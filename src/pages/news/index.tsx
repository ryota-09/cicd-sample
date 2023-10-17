import {
  getHandler1,
  getHandler2_blogs,
  getHandler2_news,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";

type Props = {
  log: string;
  data: any;
};

const Test: NextPage<Props> = ({ log, data }) => {
  return (
    <div>
      <p>log:</p>
      <p>{log}</p>
      <p>別API News: Title{data.news.title}</p>
      <div className="grid grid-cols-3 gap-3">
        {data.blogs.contents.map((item, index) => (
          <div key={index} className="mt-10 border-2 border-blue-500">
            <p>ID:{item.id}</p>
            <p>title: {item.title}</p>
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
