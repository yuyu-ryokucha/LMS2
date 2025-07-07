// LMS
export const LMS_URL: string = 'https://kulms.tl.kansai-u.ac.jp';

export const SYLLABUS_URL: string = 'https://jmrs.kyomu.kansai-u.ac.jp/htm-rt/syllabus/';
export const SYLLABUS_URL_SUFFIX: string= '.html';

export interface CourseItemType {
  courseUrlId: string,
  courseTitle: string,
  courseDayOfWeekEn: string,
  coursePeriod: number,
  timestamp: string,
}
export interface SectionItemType {
  courseUrlId: string,

  sectionUrlId: string,
  sectionTitle: string, // ない場合も数字のインクリメントで対応
  timestamp: string,
  tasks: TaskItemType[],
}
export interface TaskItemType {
  courseUrlId: string,

  taskUrlId: string,
  taskTitle: string,
  taskCategory: string,
  taskCounter: number,
  taskDeadline: string | null, // 最重要

  taskCustomId: string,
  timestamp: string,
}