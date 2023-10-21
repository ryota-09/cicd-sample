import {
  getHandler2_blogs,
  getHandler2_news,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import {  useState } from "react";

const mappedOption = {
  option1: "7lti4xmu8j4w",
  option2: "9s1s8v1to",
  option3: "qhw177d6cs",
};

type Props = {
  log: string;
  data: any;
};

const Test: NextPage<Props> = ({ log, data }) => {
  // 選択されているラジオボタンの値を状態として保持します。
  const [selectedOption, setSelectedOption] = useState("");
  const [displayedNews, setDisplayedNews] = useState(data.blogs.contents);

  // 状態フックを使ってセレクトボックスの現在の値を保持します。
  const [selectedValue, setSelectedValue] = useState("");

  // ラジオボタンの選択が変更されたときのハンドラー関数
  const handleRadioChange = async (event) => {
    const { value } = event.target;

    // 新しい値を状態にセットします。
    setSelectedOption(value);

    const constent = await fetch(
      `https://${process.env.NEXT_PUBLIC_DOMAIN_2}.microcms.io/api/v1/blogs?filters=category[contains]${selectedOption}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_API_KEY_2 || "",
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => null);
    console.log("@@@@", constent);
    setDisplayedNews(constent.contents);
    // ここで他の任意のロジックを実行できます。
    console.log("選択されたオプション:", value);
  };

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
      <div className="flex gap-5 justify-center">
        <select value={selectedValue} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="7lti4xmu8j4w">テクノロジー</option>
          <option value="9s1s8v1to">更新情報</option>
          <option value="qhw177d6cs">チュートリアル</option>
        </select>
        <hr />
        <div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="qhw177d6cs"
                checked={selectedOption === "qhw177d6cs"}
                onChange={handleRadioChange}
              />
              チュートリアル
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="7lti4xmu8j4w"
                checked={selectedOption === "7lti4xmu8j4w"}
                onChange={handleRadioChange}
              />
              テクノロジー
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="9s1s8v1to"
                checked={selectedOption === "9s1s8v1to"}
                onChange={handleRadioChange}
              />
              更新情報
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {displayedNews.map((item, index) => (
          <div key={index} className="mt-10 border-2 border-blue-500">
            <p>ID:{item.id}</p>
            <p>title: {item.title}</p>
            <br />
            <p>カテゴリ: </p>
            <div className="my-2">
              {item.category.map((itemEl, index2) => (
                <p key={index2} className="bg-blue-100">
                  {itemEl.name}
                </p>
              ))}
            </div>
            <Link href={`/news/${item.id}`} className="bg-blue-200">
              詳細ページボタン
            </Link>
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
