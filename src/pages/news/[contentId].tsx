import {
  getHandler1,
  getHandler2_blogs,
  getHandler2_news,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

type Props = {
  log: string;
  data: any;
};

const Test: NextPage<Props> = ({ log, data }) => {
  return (
    <div>
      <p>詳細ページ</p>
      <Link className="p-10 bg-red-300" href={`/news/`}>
        一覧に戻る
      </Link>
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
