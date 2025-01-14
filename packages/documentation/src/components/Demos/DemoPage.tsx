import React, { ReactElement } from "react";
import cn from "classnames";
import { defaults } from "lodash";
import Head from "next/head";

import { toId } from "utils/toTitle";

import Demo from "./Demo";
import DemoPageHeader from "./DemoPageHeader";
import { DemoPageConfig, DemoProps, DemoConfig } from "./types";

import styles from "./DemoPage.module.scss";

export interface DemoPageProps extends DemoPageConfig {
  className?: string;
  packageName: string;
}

const getDemoProps = (
  props: DemoPageProps,
  demo: DemoConfig,
  index: number
): DemoProps & { key: string } => {
  const { name } = demo;
  const { packageName } = props;
  const id = toId(name);
  const config = defaults({}, demo, props);
  return {
    ...demo,
    ...config,
    key: id,
    id,
    index,
    packageName,
  };
};

const EMPTY_LIST: string[] = [];

export default function DemoPage(props: DemoPageProps): ReactElement {
  const {
    demos,
    description,
    packageName,
    className,
    fonts = EMPTY_LIST,
  } = props;
  return (
    <div id="demo-page-container" className={cn(styles.container, className)}>
      <Head>
        {fonts.map((font) => {
          let href: string;
          if (font === "Font Awesome") {
            href =
              "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css";
          } else {
            const name = font.replace(/\s+/g, "+");
            href = `https://fonts.googleapis.com/css2?family=${name}&display=swap`;
          }

          return <link key={font} rel="stylesheet" href={href} />;
        })}
      </Head>
      <DemoPageHeader packageName={packageName}>{description}</DemoPageHeader>
      {demos.map((demo, index) => (
        // eslint-disable-next-line react/jsx-key
        <Demo {...getDemoProps(props, demo, index)} />
      ))}
    </div>
  );
}
