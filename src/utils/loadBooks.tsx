import { apiKey } from "./apiKey.json";
const URL = "https://www.googleapis.com/books/v1/volumes?q=";


// Como utilizar:
// Adicione a função principal em um arquivo de screen:

//   //hooks de controle e pesquisa:
//   const [books, setBooks] = useState<any[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [query, setQuery] = useState<string>("");

//   // função que chama a pesquisa:
//   const handleSearch = (text: string) => {
//     setQuery(text);
//     if (text.trim().length > 0) {
//       loadBooks(text, setBooks, setErrorMsg);
//     } else {
//       clearSearch();
//     }
//   };
//   // função que limpa a pesquisa, a array de livros e a mensagem de erro:
//   const clearSearch = () => {
//     setQuery("");
//     setBooks([]);
//     setErrorMsg(null);
//   };

//books é a array que guarda todos os resultados das pesquisas, seguindo por indice, as informações
//estarão em volumeInfo ("boocks[index].volumeInfo" vamos chamar de "book")

// book.imageLinks.smallThumbnail = capa pequena
// book.imageLinks.thumbnail = capa grande
// book.authors = autor
// book.publisher = editora
// book.publishedDate = data de publicação
// book.description = descrição
// book.pageCount = quantidade de paginas
// book.industryIdentifiers[0].identifier = isbn_13
// book.industryIdentifiers[1].identifier = isbn_10

async function fetchBooks(query: string, quant: string) {
  let url;

  try {
    let searchParam = query.trim();

    if (/^\d+$/.test(searchParam)) {
      searchParam = `isbn:${searchParam}`;
    }

    

    if (quant == "0"){
      url = `${URL}${encodeURIComponent(searchParam)}${apiKey}&langRestrict=pt`
    } else {
      url = `${URL}${encodeURIComponent(searchParam)}${apiKey}&maxResults=${quant}&langRestrict=pt`
    }

    console.log(url);
    

    const response = await fetch(`${url}`);

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
  quant: string,
  setBooks: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> {
  const results = await fetchBooks(query, quant);
  if (results.length === 0) {
    setErrorMsg("Não foi possível carregar os livros.");
  }
  setBooks(results);
  console.log(results);
  
};

