module.exports = function (eleventyConfig) {
  // Copy over image metadata if needed
  eleventyConfig.addPassthroughCopy("projects/**/images.json");
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Tell Eleventy to treat .md files in subfolders as templates
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
