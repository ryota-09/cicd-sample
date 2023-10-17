import {
  getHandler1,
  getHandler2_blogs,
  getHandler2_news,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

type Props = {
  log: string;
  data: any;
};

const Test: NextPage<Props> = ({ log, data }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [displayedNews, setDisplayedNews] = useState(data.blogs.contents)

  // セレクトボックスの値が変更された時に呼び出されるハンドラー関数です。
  const handleChange = (event) => {
    // セレクトボックスの新しい値を取得します。
    const newValue = event.target.value;

    // 新しい値を状態にセットしてUIを更新します。
    setSelectedValue(newValue);

    // ここで他の任意のロジックを実行できます。例えば、API呼び出しをするなど。
    console.log("選択された値:", newValue);
  };
  return (
    <div>
      <p>log:</p>
      <p>{log}</p>
      <p>別API News: Title{data.news.title}</p>
      <select value={selectedValue} onChange={handleChange}>
        <option value="">選択してください</option>
        <option value="7lti4xmu8j4w">テクノロジー</option>
        <option value="9s1s8v1to">更新情報</option>
        <option value="qhw177d6cs">チュートリアル</option>
      </select>
      <div className="grid grid-cols-3 gap-3">
        {displayedNews.map((item, index) => (
          <div key={index} className="mt-10 border-2 border-blue-500">
            <p>ID:{item.id}</p>
            <p>title: {item.title}</p>
            <Link href={`/news/${item.id}`} className="bg-blue-200">
              詳細ページボタン
            </Link>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "no-store");
  // 時間計測の開始（[秒, ナノ秒] のタプルを返します）

  const [news, blogs] = await Promise.all([
    getHandler2_news(),
    getHandler2_blogs(),
  ]);

  const data = {
    news: news,
    blogs: blogs,
  };

  return {
    props: {
      log: "CMS2_複数のAPIを統合したケース",
      data: data,
    },
  };
};
