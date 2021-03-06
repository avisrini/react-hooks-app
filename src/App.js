import React from "react";
import axios from "axios";

import "./App.css";
import { ReactComponent as Check } from "./check.svg";

const List = ({ list, onRemoveItem }) => {
    return list.map((item) => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);
};

const Item = ({ item, onRemoveItem }) => (
    <div className="item">
        <span style={{ width: "40%" }}>
            <a href={item.url}>{item.title}</a>
        </span>

        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span style={{ width: "10%" }}>
            <button type="button" onClick={() => onRemoveItem(item)} className="button button_small">
                Dismiss
            </button>
        </span>
    </div>
);

const InputWithLabel = ({ id, value, type = "text", onInputChange, isFocused, children }) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);
    return (
        <>
            <label htmlFor={id} className="label">
                {children}
            </label>
            &nbsp;
            <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} className="input" />
        </>
    );
};

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    console.log(state);
    switch (action.type) {
        case "STORIES_FETCH_SUCCESS":
            return { ...state, iLoading: false, isError: false, data: action.payload };
        case "STORIES_FETCH_INIT":
            return { ...state, iLoading: true, isError: false };
        case "STORIES_FETCH_ERROR":
            return { ...state, isError: true, iLoading: false };
        case "REMOVE_STORY":
            return { ...state, data: state.data.filter((story) => story.objectID !== action.payload.objectID) };
        default:
            throw new Error("Invalid Reducer action type");
    }
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
    <form onSubmit={onSearchSubmit} className="search-form">
        <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
            <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm} className="button button_large">
            <Check height="18px" width="18px" />
        </button>
    </form>
);

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState("lastSearch", "");
    const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: "STORIES_FETCH_INIT" });

        try {
            const result = await axios.get(url);
            dispatchStories({ payload: result.data.hits, type: "STORIES_FETCH_SUCCESS" });
        } catch {
            dispatchStories({ type: "STORIES_FETCH_ERROR" });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveStory = (item) => {
        dispatchStories({ payload: item, type: "REMOVE_STORY" });
    };

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    };

    return (
        <div className="container">
            <h1 className="headline-primary">My Hacker Stories</h1>
            <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? <>Loading...</> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}
        </div>
    );
};

export default App;
