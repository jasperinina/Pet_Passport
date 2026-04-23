export const parseSections = (markdownText) => {
  const sections = [];
  const lines = markdownText.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isMainHeading = line.match(/^#\s/);

    if (isMainHeading) {
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n'),
        });
      }
      currentSection = line.replace(/^#\s/, '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n'),
    });
  }
  return sections;
};