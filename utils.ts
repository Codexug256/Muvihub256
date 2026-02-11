
export const truncate = (s: string | undefined, n: number) => 
  (s && s.length > n ? s.slice(0, n - 1) + '…' : s);

export const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return 'Unknown date';
  return new Date(timestamp).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const extractTagsFromDescription = (description: string | undefined): string[] => {
  if (!description) return [];
  const tagRegex = /#(\w+)/g;
  const matches = description.match(tagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
};

export const extractYearFromTitle = (title: string): string | null => {
  const yearMatch = title.match(/\((\d{4})\)$/);
  return yearMatch ? yearMatch[1] : null;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
