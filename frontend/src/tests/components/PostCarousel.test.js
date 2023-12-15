import React from "react";
import { render } from "@testing-library/react";
import PostCarousel from "../../modules/app/components/PostCarousel";

describe("PostCarousel component", () => {
  it("renders images correctly", () => {
    const samplePost = {
      images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    };

    const { asFragment } = render(<PostCarousel post={samplePost} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly without images, mathes snapshot", () => {
    const samplePost = {
      images: [],
    };
    const { asFragment } = render(<PostCarousel post={samplePost} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
