import * as React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";

/** Monospace labels use SpaceMono (loaded in root layout); keep a stable snapshot without Themed/color scheme. */
it("renders monospace label style", () => {
  let tree;
  act(() => {
    tree = renderer
      .create(
        <Text style={{ fontFamily: "SpaceMono" }}>Snapshot test!</Text>,
      )
      .toJSON();
  });

  expect(tree).toMatchSnapshot();
});
