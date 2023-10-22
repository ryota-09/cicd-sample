import {
  getHandler1,
  getHandler2_blogs,
  getHandler2_current_blog,
  getHandler2_news,
  getHandler2_prev_and_next,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

type Props = {
  log: string;
  content: any;
  data: any;
};

const Test: NextPage<Props> = ({ log, content, data }) => {
  return (
    <div>
      <p className="mb-10">詳細ページ</p>
      <Link className="p-10 bg-red-300" href={`/news/`}>
        一覧に戻る
      </Link>
      <p className="mt-10">ID: </p>
      <p>{content.id}</p>
      <p className="mt-12">{content.title}</p>
      <p className="mt-12">publishedAt : </p>
      <p>{content.publishedAt}</p>
      <div className="mt-12">
        前後の記事
        <div>
          {data.prev.contents.length !== 0 && (
            <Link href={`/news/${data.prev.contents[0].id}`}>
              <p className="text-blue-500">
                前の記事: {data.prev.contents[0].title} (
                {data.prev.contents[0].publishedAt})
              </p>
            </Link>
          )}
          {data.next.contents.length !== 0 && (
            <Link href={`/news/${data.next.contents[0].id ?? ""}`}>
              <p className="text-red-500">
                後の記事: {data.next.contents[0].title} (
                {data.next.contents[0].publishedAt})
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "no-store");
  if(!context.params) return { notFound: true }
  // 時間計測の開始（[秒, ナノ秒] のタプルを返します）
  const contentId = context.params.contentId

  const content = await getHandler2_current_blog(contentId as string);

  const data = await getHandler2_prev_and_next(content.publishedAt);
  console.log(data);
  return {
    props: {
      log: "CMS2_複数のAPIを統合したケース",
      content: content,
      data: data,
    },
  };
};
