import Dexie from 'dexie';

const SYLLABUS_URL_BASE_KU2025SOJO = `https://syllabus3.jm.kansai-u.ac.jp/syllabus/search/curri/2025/10/210/202510210010ZZZZ_.html`; // 関大総情2025

export default defineContentScript({
  matches: ['*://*.kulms.tl.kansai-u.ac.jp/*'],
  main() {
    console.log('Hello content.');

    // 時間割を取得
    if (false === document.URL.includes("course")) {
      const tableElement: HTMLElement | null = document.querySelector("#schedule-table");
      if (tableElement !== null)
        getCoursesByTimetableElem(tableElement);

      // シラバスへのリンクを追加
      const courseLinkTagElems = document.querySelectorAll("#schedule-table a, #courses_list_left a");
      if (courseLinkTagElems.length > 0)
        addSyllabusLinkToLms(courseLinkTagElems, SYLLABUS_URL_BASE_KU2025SOJO);
    }
    // 課題を取得
    else if (true === document.URL.includes("kulms.tl.kansai-u.ac.jp/webclass/course.php")) {
      const docHtmlElem: HTMLElement | null = document.querySelector("body");
      if (docHtmlElem !== null)
        getSectionsAndTasks(docHtmlElem, document.URL);
    }

  },
});

interface CourseItemType {
  courseUrlId: string,
  courseTitle: string,
  courseDayOfWeekEn: string,
  coursePeriod: number,
  timestamp: string,
}
/**
 * LMSのトップページにある時間割表のtableタグ(#schedule-table)を処理する
 * @param tableElement
 * @return courseUrlIdがキーでCourseItemTypeがバリューの辞書
 */
async function getCoursesByTimetableElem(tableElement: HTMLElement): Promise<Record<string, CourseItemType>> {

  const courseMap: Record<string, CourseItemType> = {};
  const courseLinkElemArray = tableElement.querySelectorAll('a[href*="/webcourse/course.php/"]') as unknown as HTMLAnchorElement[]; // courseごとのaタグを一括で取得

  for (const courseLinkElem of courseLinkElemArray) {
    // 重要 URLからコースの一意のIDを抽出する
    const courseUrl = courseLinkElem.getAttribute("href");
    const courseUrlId = courseUrl?.substring(courseUrl.indexOf("course.php/") + 11, courseUrl.indexOf("/login")) ?? "";

    // コースのタイトルを見やすくする そこまで重要ではない
    const courseTitleRaw = courseLinkElem.innerText;
    const courseTitle = courseTitleRaw // 「» プログラミング実習（Ｃ）[  1] (2025-春学期-月曜日-4限-70605)」
      .slice(0, courseTitleRaw.indexOf("(20")) // 「» プログラミング実習（Ｃ）[  1] 」 順番を変えると動かなく成る
      .replace("» ", "")  // 「プログラミング実習（Ｃ）[  1] 」
      .replace(/(?=\[\s).*$/, "") // 「プログラミング実習（Ｃ）[  1] 」
      .replace(/(?=\s\().*$/, "") //
      .trim(); // 仕上げ
    const courseTitleForSyllabusSearch = courseTitle.replace(/[初中上]級/g, "").replace(/＜[CMS]＞/g, ""); // シラバス検索でヒットするように

    // 曜日と時限目 時間割の構築に重要
    const courseDayOfWeek = (courseTitleRaw.match(/[月火水木金土日]曜日/) || ["他"])[0]; // リンクテキスト依存 本来はthタグから解析すべき
    const coursePeriodRaw = courseTitleRaw.match(/[12345678]\s?限/); // リンクテキスト依存 本来はtdタグから解析すべき
    const coursePeriod = coursePeriodRaw ? Number(coursePeriodRaw?.[0].trim().slice(0, 1)) : Number(0);

    // 1つのアイテムとして整形
    const courseItem: CourseItemType = {
      courseUrlId: courseUrlId,
      courseTitle: courseTitleForSyllabusSearch,
      courseDayOfWeekEn: mapDayOfWeek[courseDayOfWeek],
      coursePeriod: coursePeriod,
      timestamp: String(new Date()),
    };

    courseMap[courseItem.courseUrlId] = courseItem; // プッシュ
  };
  console.log(courseMap);
  return courseMap;
};



interface SectionItemType {
  courseUrlId: string,

  sectionUrlId: string,
  sectionTitle: string, // ない場合も数字のインクリメントで対応
  timestamp: string,
  tasks: TaskItemType[],
}
interface TaskItemType {
  courseUrlId: string,

  taskUrlId: string,
  taskTitle: string,
  taskCategory: string,
  taskCounter: number,
  taskDeadline: string | null, // 最重要

  taskCustomId: string,
  timestamp: string,
}
/**
 * LMSのコースページにおいてセクション(親)とタスク(子)を取得・保存する
 * @param tableElement
 */
async function getSectionsAndTasks(docHtmlElem: HTMLElement, docUrl: string) {

  // 重要
  const courseUrlId = docUrl.substring(docUrl.indexOf("course.php/") + 11, docUrl.indexOf("/?"));

  // ほぼ固定位置
  const sectionArray: SectionItemType[] = [];

  const sectionElemArray = docHtmlElem.querySelectorAll('.cl-contentsList_folder'); // ひとつひとつのsectionのdivタグが入る
  for (let i = 0; i < sectionElemArray.length; i++) {
    const sectionTitle = sectionElemArray[i].querySelector('.panel-title')?.textContent?.trim() || `no title (${i + 1})`;
    const sectionId = sectionElemArray[i].getAttribute("id") ?? `no title (${i + 1})`;
    const tasksElemArray = sectionElemArray[i].querySelectorAll('.list-group > .cl-contentsList_listGroupItem');

    const section: SectionItemType = {
      courseUrlId: courseUrlId,
      sectionTitle: sectionTitle,
      sectionUrlId: sectionId,
      tasks: [], // 配列（タスク）
      "timestamp": String(new Date()),
    };

    for (const tasksElem of tasksElemArray) {
      const taskTitle = tasksElem.querySelector(".cm-contentsList_contentName > :not(.cl-contentsList_new)")?.textContent ?? "no title";
      const taskTitleLinkElem = tasksElem.querySelector(".cm-contentsList_contentName > a");
      const taskTitleLinkElemHref = taskTitleLinkElem ? taskTitleLinkElem.getAttribute("href") : "";
      const taskTitleId = taskTitleLinkElemHref && new URLSearchParams(taskTitleLinkElemHref.split('?')[1])?.get('set_contents_id') ? new URLSearchParams(taskTitleLinkElemHref.split('?')[1])?.get('set_contents_id') : `no id ${i}`;

      const taskCategory = (tasksElem.querySelector("div.cl-contentsList_categoryLabel"))?.textContent ?? "未分類";
      const taskCounterRaw = (tasksElem.querySelector("div.cl-contentsList_contentDetailListItemData > a[href*='history']") || { textContent: "利用回数 0" }).textContent;

      // 日時
      const taskDateElem = tasksElem.querySelector('div.cm-contentsList_contentDetailListItemLabel + div.cm-contentsList_contentDetailListItemData');
      const taskDateRaw = taskDateElem && taskDateElem.textContent ? taskDateElem.textContent.trim() : "nodeadline";
      const dates = taskDateRaw.match(/(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2})/g);

      // 日時取得の機構 とても闇が深い 仕様変更で壊れるとしたらココ
      let taskDeadline: Date | null | undefined;
      let taskDeadlineRaw;
      if (dates && dates.length === 2) {
        taskDeadlineRaw = dates?.[1] ?? "";
        taskDeadline = taskDeadlineRaw ? new Date(dates[1]) : null;
      }

      const task: TaskItemType = {
        courseUrlId: courseUrlId,

        taskTitle: taskTitle,
        taskUrlId: taskTitleId ?? `no id ${i}`,
        taskCustomId: `${taskTitle}@${courseUrlId}`,
        taskCategory: taskCategory,
        taskCounter: Number(taskCounterRaw?.replace(/[^0-9]/g, '') ?? 0),

        taskDeadline: taskDeadline ? String(taskDeadline) : null,
        timestamp: String(new Date()),
      };

      section.tasks.push(task);
    };
    sectionArray.push(section);
  };

  const courseSectionMap: Record<string, SectionItemType[]> = {};
  courseSectionMap[courseUrlId] = sectionArray;

  console.log(courseSectionMap);

  return courseSectionMap;
};

const mapDayOfWeek: Record<string, "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" | "Other"> = {
  '月曜日': 'Mon', '火曜日': 'Tue', '水曜日': 'Wed', '木曜日': 'Thu', '金曜日': 'Fri', '土曜日': 'Sat', '日曜日': 'Sun',
  '月曜': 'Mon', '火曜': 'Tue', '水曜': 'Wed', '木曜': 'Thu', '金曜': 'Fri', '土曜': 'Sat', '日曜': 'Sun', /* '日': 'Sun'　←これ大丈夫？ */
  'その他': 'Other', '他': 'Other', 'オンライン': 'Other', 'オンデマンド': 'Other',
};


/**
 * トップページの時間割表にシラバスへのリンクを貼る関数 30行で完結し外部依存なし
 *  @param courseLinkTagElems 時間割表の各コースのaタグ
 *  @param syllabusBaseUrl シラバスのベースのURL
 */
async function addSyllabusLinkToLms(courseLinkTagElems: NodeListOf<Element>, syllabusBaseUrl: string) {

  for (const courseLinkTagElemnt of courseLinkTagElems) {
    const minimumCourseTitle = courseLinkTagElemnt.textContent
      ?.replace("» ", "")
      ?.split(" (20")[0]
      ?.split("＜")[0]
      ?.replace("上級", "")
      ?.replace("中級", "")
      ?.replace("初級", "")
      ?.split("[")[0]
      ?.trim(); // 検索用にミニマムな授業名を抽出

    const syllabusAddress = `${syllabusBaseUrl}#:~:text=${encodeURIComponent(minimumCourseTitle ?? "")}`; // ブラウザの機能でアンカーリンク

    const syllabusLink = document.createElement("a");
    syllabusLink.setAttribute("href", syllabusAddress);
    syllabusLink.setAttribute("target", "_blank"); // 新しいタブで開く
    syllabusLink.setAttribute("rel", "noreferrer noopener"); // aタグのセキュリティ対策
    syllabusLink.className = "syllabus-link"; // これでCSSで.syllabus-link{}でカスタムできる（今はしていない）
    syllabusLink.setAttribute("style", "display: block; text-decoration: none;"); // 直書き 
    syllabusLink.textContent = "📚"; // リンクテキスト

    // a要素の直後に追加
    courseLinkTagElemnt.insertAdjacentElement("afterend", syllabusLink);
  }
}