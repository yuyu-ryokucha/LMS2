import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
// import './App.css';
import { Button } from '@/components/ui/button';

import Timetable from '../../components/Timetable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideCalendar, LucideListOrdered, LucideSettings } from 'lucide-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Tabs defaultValue="timetable">
        <TabsList className='w-full gap-1 flex'>
          <TabsTrigger value="timetable" className='px-2 w-fit'><LucideListOrdered />時間割</TabsTrigger>
          <TabsTrigger value="calendar" className='px-2 w-fit'><LucideCalendar />カレンダー</TabsTrigger>
          <TabsTrigger value="settings" className='px-2 w-fit'><LucideSettings />設定</TabsTrigger>
        </TabsList>
        <TabsContent value="timetable">
          {/* <LastUpdatedAt /> */}
          <Timetable />
        </TabsContent>
        <TabsContent value="calendar">
          {/* <Calendar /> */}
        </TabsContent>
        <TabsContent value="settings">
          <div>
            Notion連携
            生成AI向けのドキュメントをエクスポートします。Notionへの自動エクスポートを設定すると、NotionAIやMCPプロトコル対応の生成AIに課題管理を任せることができます。
          </div>
          <div>
            プロファイル
            関西大学・総合情報学部
          </div>

        </TabsContent>
      </Tabs>

      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Button />
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
