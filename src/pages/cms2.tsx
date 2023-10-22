import { getHandler2_blogs, getHandler2_news } from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";

type Props = {
  log: string;
  performanceTime: string
  data: any;
};

const Test: NextPage<Props> = ({log, performanceTime, data }) => {
  return (
    <div>
      <p>log:</p>
      <p>{log}</p>
      <p>performanceTime:</p>
      <p>{performanceTime}</p>
      <p>data:</p>
      <p>{data}</p>
    </div>
  );
};
export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store')
  // 時間計測の開始（[秒, ナノ秒] のタプルを返します）
  const startTime = process.hrtime();

  const [ news, blogs ] = await Promise.all([
    getHandler2_news(),
    getHandler2_blogs("", 100)
  ])

  const data = {
    news: news,
    blogs: blogs
  }

  // 時間計測の終了と実行時間の計算
  const diffTime = process.hrtime(startTime);

  const executionTime = (diffTime[0] * 1e3 + diffTime[1] * 1e-6).toFixed(3); 


  // 実行時間をログに出力
  console.log(`CMS2_複数のAPIを統合したケース Function execution time: ${executionTime} milliseconds`);
  return {
    props: {
      log: "CMS2_複数のAPIを統合したケース",
      performanceTime: `${executionTime} ms`,
      data: JSON.stringify(data),
    },
  };
};
