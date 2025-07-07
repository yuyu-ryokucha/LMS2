import Dexie, { type EntityTable } from 'dexie';

interface Friend {
  id: number;
  name: string;
  age: number;
}

interface CourseType {
  courseId: string;
  title: string;
}
interface SectionType {
  sectionIndex: number;
  title: string;
}
interface TaskType {
  taskId: string;
  title: string;
}

const db = new Dexie('TasksDatabase') as Dexie & {
  friends: EntityTable<
    Friend,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  friends: '++id, name, age' // primary key "id" (for the runtime!)
});

export type { Friend };
export { db };