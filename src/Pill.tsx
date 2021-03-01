import * as React from "react";

interface Props {}

interface PillState {}

export class Pill extends React.Component<Props, PillState> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  public render() {
    const thePill = (
      <span
        ref="myPill"
        style={{
          border: "0.5px solid",
          borderRadius: "10.5px",
          padding: "4px",
          cursor: "pointer",
          margin: "0 4px 0 4px"
        }}
      >
        <span className="pill-content">
          <i className="fa fa-bolt" />
          <div
            style={{ display: "inline-block" }}
            className="invisible-text-wrapper"
          >
            Custom Entity
          </div>
        </span>
      </span>
    );
    return thePill;
  }
}
