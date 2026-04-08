const apiKey = "AIzaSyDSR4lubkBGGr-gBHicZlNGy0S4d26ucC8"

async function fetchBooks(query: string) {
  try {
    let searchParam = query.trim();

    if (/^\d+$/.test(searchParam)) {
      searchParam = `isbn:${searchParam}`;
    }
    else if (searchParam.toLowerCase().startsWith("autor:")) {
      const autor = searchParam.replace(/autor:/i, "").trim();
      searchParam = `inauthor:${autor}`;
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchParam)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Erro ao buscar:", err.message);
    return [];
  }
}

export async function loadBooks(
  query: string,
  setBooks: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> {
  const results = await fetchBooks(query);
  if (results.length === 0) {
    setErrorMsg("Não foi possível carregar os livros.");
  }
  setBooks(results);
  console.log(results);
};

