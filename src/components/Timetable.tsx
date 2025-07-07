import React from 'react';
import { CourseItemType, SectionItemType, TaskItemType, LMS_URL, SYLLABUS_URL } from '../type';

import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from './ui/button';

dayjs.extend(utc); // UTCプラグインを読み込み
dayjs.extend(timezone); // timezoneプラグインを読み込み
dayjs.locale('ja'); // 日本語化
dayjs.tz.setDefault('Asia/Tokyo'); // タイムゾーンのデフォルトをJST化
dayjs.extend(relativeTime);

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideEllipsis, LucideEllipsisVertical, LucideFilePen, LucideGraduationCap, LucideRefreshCcw, LucideRotateCw, LucideTriangleAlert } from 'lucide-react';


function App() {
    // const [timetable, setTimetable] = React.useState<{ [key: string]: TimetableItem }>({});
    // const [sections, setSections] = React.useState<Record<string, SectionItem[]>>({});
    const [todoList, setTodoList] = React.useState({});

    // 非同期ロード関数
    const loadTimetableFromChromeStorage = async () => {
        try {
            chrome.storage.local.get("timetable", function (data) {
                // setTimetable(JSON.parse(data["timetable"]) ?? {});
            });
            chrome.storage.local.get("sections", function (data) {
                // setSections(JSON.parse(data["sections"]) ?? {});
            });

        } catch (error) {
            console.error("データの読み込み時にエラー:", error);
        }
    };

    React.useEffect(() => {
        loadTimetableFromChromeStorage();
    }, []);

    // const groupedByDayAndPeriod = Object.values(timetable).reduce((acc, item) => {
    //     const day = item.class_dayofweek_en;
    //     const period = String(item.class_period); // オブジェクトのキーにするため文字列に変換

    //     // 曜日キーが未定義なら初期化
    //     if (!acc[day]) {
    //         acc[day] = {};
    //     }

    //     // 同じ period に複数ある場合の処理が必要ならここで検討（現状は上書き）
    //     acc[day][period] = item;

    //     return acc;
    // }, {} as Record<string, Record<string, TimetableItem>>);


    // const groupedAllTasks: {
    //     today: TaskItem[],
    //     within48h: TaskItem[],
    //     within72h: TaskItem[],
    //     within240h: TaskItem[],
    //     later: TaskItem[],
    //     noDeadline: TaskItem[],
    // } = {
    //     today: [],
    //     within48h: [],
    //     within72h: [],
    //     within240h: [],
    //     later: [],
    //     noDeadline: [],
    // };
    // const now = new Date();
    // const todayEnd = new Date(now);
    // todayEnd.setHours(23, 59, 59, 999);

    // const hoursFromNow = (date: Date): number =>
    //     Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));

    // for (const sectionList of Object.values(sections)) {
    //     for (const section of sectionList) {
    //         for (const task of section.section_tasks) {
    //             if (!task.task_deadline) {
    //                 groupedAllTasks.noDeadline.push(task);
    //                 continue;
    //             }

    //             const deadline = new Date(task.task_deadline);
    //             const hours = hoursFromNow(deadline);

    //             if (deadline <= todayEnd) {
    //                 groupedAllTasks.today.push(task);
    //             } else if (hours <= 48) {
    //                 groupedAllTasks.within48h.push(task);
    //             } else if (hours <= 72) {
    //                 groupedAllTasks.within72h.push(task);
    //             } else if (hours <= 240) {
    //                 groupedAllTasks.within240h.push(task);
    //             } else {
    //                 groupedAllTasks.later.push(task);
    //             }
    //         }
    //     }
    // }

    return (
        <>
            <Button variant={'outline'} onClick={() => loadTimetableFromChromeStorage()}>更新</Button>

            <div>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Other"].map((item, index) => {
                    // const targetItem = groupedByDayAndPeriod[item];

                    // console.log(targetItem);
                    return (
                        <>
                            {/* コース */}
                            <div className='py-2'>
                                <Card className='gap-4 shadow-2xs'>
                                    <CardHeader>
                                        <CardTitle className='text-xl'>{mapDayOfWeek[item]}</CardTitle>
                                        <CardDescription>時間割</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ol key={index} className="list-decimal list-inside" >
                                            {[...Array(6).keys()].map((_, index) => {
                                                // if (!(targetItem?.[String(index + 1)])) return <li key={index + 1} style={{ whiteSpace: "nowrap", overflow: "scroll", paddingBottom: "0.5rem" }}></li>;

                                                return (
                                                    <li key={index + 1} style={{ whiteSpace: "nowrap", overflow: "scroll", paddingBottom: "0.5rem" }}>
                                                        {/* 授業名 */}
                                                        <span className='inline-flex gap-1'>
                                                            <a
                                                                className="font-bold"
                                                                // href={`${LMS_URL}/webclass/login.php?group_id=${targetItem?.[String(index + 1)].class_id}`}
                                                                target={'_blank'}
                                                                rel={`noopener noreferrer`}
                                                            >
                                                                {/* {targetItem?.[String(index + 1)]?.class_title} */}
                                                            </a>

                                                            <div className='inline-flex gap-1 items-center'>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger className='cursor-pointer'><LucideEllipsisVertical width={16} height={16} className='opacity-50' /></DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuItem>
                                                                            <LucideFilePen width={18} height={18} />
                                                                            <span>メモ</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <LucideFilePen width={18} height={18} color='transparent' />
                                                                            <a
                                                                                target={"_blank"}
                                                                                // href={`https://syllabus3.jm.kansai-u.ac.jp/syllabus/search/curri/2025/10/210/202510210010ZZZZ_.html?nendo=0;bu=0;gakubu=9;gakka=0;senko=0;couse=0;def_gakubu=#:~:text=${targetItem?.[String(index + 1)]?.class_title_short}`}
                                                                            >
                                                                                シラバスを検索（総情）
                                                                            </a>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>

                                                        </span>

                                                        <div>
                                                            {/* <SectionsList sections={sections[targetItem?.[String(index + 1)]?.class_id]} /> */}
                                                        </div>


                                                    </li>
                                                )
                                            })}
                                        </ol>
                                    </CardContent>
                                    <CardFooter>
                                        {/* <p>Card Footer</p> */}
                                    </CardFooter>
                                </Card>
                            </div>
                        </>
                    )
                })}
            </div>


            <Card className='gap-4'>
                <CardHeader>
                    <CardTitle>期限の近い課題</CardTitle>
                    <CardDescription>早めに取り組んでください</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul style={{ paddingTop: "0.1rem", whiteSpace: "nowrap", overflow: "scroll" }}>
                        {/* {Object.entries(groupedAllTasks).map(([key, tasks]) => (
                            <li key={key} className='pb-5'>
                                <h2>{MapDeadlineKey[key]}</h2>
                                <ul>
                                    {tasks.map((task, index) => {
                                        const currentTimeTableItem = timetable?.[task.class_id];
                                        return (
                                            <li key={index} style={task.task_category === "資料" ? { opacity: 0.25 } : {}} className='inline-flex items-center'>
                                                <span>{dayjs(task.task_deadline,).tz('Asia/Tokyo').format("MM/DD HH時")} </span>
                                                <span>{task.class_title?.slice(0, 8)}</span>
                                                <span>@{MapDayOfWeek[currentTimeTableItem?.class_dayofweek_en]}{currentTimeTableItem?.class_period} </span>
                                                <span>{task.task_title}</span>
                                                <span className='text-sm'>({task.task_category})</span>
                                                <span>{task.task_deadline}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>
                        ))} */}

                    </ul>
                </CardContent>
                <CardFooter>
                    {/* <p>Card Footer</p> */}
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className='flex items-center gap-2'>
                            <LucideTriangleAlert />
                            <span>長期間未更新の授業</span>
                        </div>
                    </CardTitle>
                    {/* <CardDescription>授業ページを訪れて更新してください</CardDescription> */}
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter>
                    {/* <p>Card Footer</p> */}
                </CardFooter>
            </Card>

        </>
    );
}


export default App;



const SectionsList = ({ sections }: { sections: SectionItemType[] }) => {
    return (
        <ul style={{ marginLeft: "1rem" }}>
            {sections?.map((section, index) => {
                return (
                    <li key={index} style={{ paddingTop: "0.5rem" }}>
                        <div></div>
                        <div className='text-xs opacity-50 pb-0.25'>{section?.sectionTitle}</div>
                        <div><TasksList tasks={section?.tasks} /></div>
                    </li>
                );
            })}
        </ul>
    );
};

const TasksList = ({ tasks }: { tasks: TaskItemType[] }) => {

    return (
        <ul>
            {tasks.map((task, index) => {

                const url = task.taskUrlId
                    ? `${LMS_URL}/webclass/login.php?id=${task.taskUrlId}&page=1`
                    : "#";

                return (
                    <li key={index} className='py-1.5'>
                        <div data-ref="checklist-item" className='flex gap-2 items-center text-sm'>
                            <Checkbox />
                            <time dateTime={task.taskDeadline ?? ""}>
                                {!isNaN(new Date(task.taskDeadline ?? "").getDate()) ? dayjs(task.taskDeadline).format('MM/DD HH') : "--/-- --"}
                            </time>
                            <a
                                target={'_blank'}
                                rel={`noopener noreferrer`}
                                href={url}
                                className='font-bold'
                            >
                                {task.taskTitle}
                            </a>
                            <div className='tag'>
                                <span className='tag-hash'>#</span>
                                <span className='tag-text'>{task.taskCategory}</span>
                            </div>
                            <div className='text-xs'>
                                （{task.taskCounter ?? 0}回）
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};



const mapDayOfWeek: Record<string, string> = {
    '月曜日': 'Mon', '火曜日': 'Tue', '水曜日': 'Wed', '木曜日': 'Thu', '金曜日': 'Fri', '土曜日': 'Sat', '日曜日': 'Sun', 'その他': 'Other', '他': 'Other', 'オンライン': 'Other', 'オンデマンド': 'Other',
    '月曜': 'Mon', '火曜': 'Tue', '水曜': 'Wed', '木曜': 'Thu', '金曜': 'Fri', '土曜': 'Sat', '日曜': 'Sun', /* '日': 'Sun'　←これ大丈夫？ */
    "Mon": '月曜', "Tue": '火曜', "Wed": '水曜', "Thu": '木曜', "Fri": '金曜', "Sat": '土曜', "Other": 'その他',
};

const mapDeadlineKey: Record<string, string> = {
    'today': '〜24時間',
    'within48h': '〜48時間',
    'within72h': '〜72時間',
    'within240h': '〜10日間',
}