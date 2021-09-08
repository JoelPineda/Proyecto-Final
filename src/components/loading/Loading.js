import React from "react";
import ReactLoading from "react-loading";

import { Article, list, Prop, Section } from "./Generic";

const Loading = () => (
  <div className="loading body">
    <Section>
    {list.map(l => (
      <Article key={l.prop}>
        <ReactLoading type={l.prop} color="#fff" />
        <Prop>{l.name}</Prop>
      </Article>
    ))}
  </Section>
  </div>
);

export default Loading;