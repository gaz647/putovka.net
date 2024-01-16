/* eslint-disable react/prop-types */
import "./Heading.css";

const Heading = ({ text }: { text: string }) => {
  return <div className="heading text-shadow">{text}</div>;
};

export default Heading;
