import React from "react";
import renderer from "react-test-renderer";
import Posts from "../../modules/app/components/Posts";

jest.mock("../../modules/app/store/filters", () => ({
  useFiltersStore: jest.fn(),
}));

describe("Posts Component", () => {
  it("renders correctly", () => {
    const mockUseFiltersStore = {
      price: 0,
      category: "",
      type: "",
      fetchPosts: jest.fn(),
      filterPosts: jest.fn(),
      posts: [],
      filteredPosts: [],
      query: "",
      stillValid: true,
      created: "",
      expDate: "",
    };

    require("../../modules/app/store/filters").useFiltersStore.mockReturnValue(mockUseFiltersStore);
    const component = renderer.create(<Posts />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});