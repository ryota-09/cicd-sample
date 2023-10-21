import { getHandler2_blogs, getHandler2_news } from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

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
  const router = useRouter(); // Next.jsのルーターフックを使用

  const isEmpty =
    Object.keys(router.query).length === 0 &&
    router.query.constructor === Object;

  const initCategory =
    isEmpty && router.query["category"]?.length === 0
      ? ""
      : router.query["category"];

  const initTags =
    isEmpty && router.query["tags"]?.length === 0 ? "" : router.query["tags"];

  // 状態フックを使ってセレクトボックスの現在の値を保持します。
  const [selectedValue, setSelectedValue] = useState(initTags);
  const [selectedOption, setSelectedOption] = useState(initCategory);
  
  // ラジオボタンの選択が変更されたときのハンドラー関数
  const handleRadioChange = async (event) => {
    const { value } = event.target;
    setSelectedOption(value)

    let searchParams =
      isEmpty || router.query["category"]?.length === 0
        ? `?category=${value}`
        : `?tags=${selectedValue}&category=${value}`;

    // 選択されたオプションを使ってURLを構築し、そのURLに遷移する
    router.push({
      pathname: `/news`, // 現在のページに留まるか、または別のルートを指定する
      search: searchParams,
      // クエリパラメータを付与
    });
  };

  // セレクトボックスの値が変更された時に呼び出されるハンドラー関数です。
  const handleChange = (event) => {
    const isEmpty =
      Object.keys(router.query).length === 0 &&
      router.query.constructor === Object;
    const { value } = event.target;
    
    setSelectedValue(value)
    
    let searchParams =
      isEmpty || router.query["tags"]?.length === 0
        ? `?tags=${value}`
        : `?category=${selectedOption}&tags=${value}`;

    router.push({
      pathname: "/news", // 現在のページに留まるか、または別のルートを指定する
      search: searchParams, // クエリパラメータを付与
    });
  };

  return (
    <div>
      <p>log:</p>
      <p>{log}</p>
      <p>別API News: Title{data.news.title}</p>
      <div className="flex gap-5 justify-center">
        <select value={selectedValue} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="apple">apple</option>
          <option value="orange">orange</option>
          <option value="lemon">lemon</option>
          <option value="banana">banana</option>
          <option value="other">other</option>
        </select>
        <hr />
        <div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="info"
                checked={selectedOption === "info"}
                onChange={handleRadioChange}
              />
              お知らせ
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="about"
                checked={selectedOption === "about"}
                onChange={handleRadioChange}
              />
              詳細について
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="contact"
                checked={selectedOption === "contact"}
                onChange={handleRadioChange}
              />
              問い合わせ
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="options"
                value="other"
                checked={selectedOption === "other"}
                onChange={handleRadioChange}
              />
              その他
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {data.blogs.contents.map((item, index) => (
          <div key={index} className="mt-10 border-2 border-blue-500">
            <p>ID:{item.id}</p>
            <p>title: {item.title}</p>
            <br />
            <p>カテゴリ: </p>
            <p className="bg-blue-50">{item.category}</p>
            <p>tags: </p>
            <div className="my-2">
              {item.tags.map((itemEl, index2) => (
                <span key={index2} className="bg-blue-100">
                  {itemEl},
                </span>
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
  // リクエストからクエリパラメータを取得
  const { category, tags } = context.query;

  // フィルタリング条件を設定
  let filterQuery = "";
  if (category && tags) {
    filterQuery = `category[contains]${category}[and]tags[contains]${tags}`;
  } else if (category) {
    // ここでMicroCMSのフィルタリング機能を使用してクエリを構築します。
    // 例えば、'option'フィールドが特定の値と一致するコンテンツをフィルタリングする場合：
    filterQuery = `category[contains]${category}`;
  } else if (tags) {
    // ここでMicroCMSのフィルタリング機能を使用してクエリを構築します。
    // 例えば、'option'フィールドが特定の値と一致するコンテンツをフィルタリングする場合：
    filterQuery = `tags[contains]${tags}`;
  }

  const [news, blogs] = await Promise.all([
    getHandler2_news(),
    getHandler2_blogs(filterQuery),
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
