import React from "react";

const List = ({ list, onRemoveStory }) => {
    return list.map((item) => <Item key={item.objectID} item={item} onRemoveStory={onRemoveStory} />);
};

const Item = ({ item, onRemoveStory }) => {
    return (
        <div>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <button id="remove-story" onClick={() => onRemoveStory(item)}>
                Dismiss
            </button>
        </div>
    );
};

const InputWithLabel = ({ id, children, type = "text", defaultValue, onInputChange }) => {
    const handleChange = (event) => {
        onInputChange(event);
    };

    return (
        <div>
            <label htmlFor={id}>{children}</label>
            <input id={id} type={type} value={defaultValue} onChange={handleChange} />
            <p>
                Searching for <strong>{defaultValue}</strong>
            </p>
        </div>
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
const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState("lastSearch", "");
    const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

    React.useEffect(() => {
        if (!searchTerm) return;
        dispatchStories({ type: "STORIES_FETCH_INIT" });

        fetch(`${API_ENDPOINT}${searchTerm}`)
            .then((response) => response.json())
            .then((result) => {
                dispatchStories({ payload: result.hits, type: "STORIES_FETCH_SUCCESS" });
            })
            .catch(() => {
                dispatchStories({ type: "STORIES_FETCH_ERROR" });
            });
    }, [searchTerm]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveStory = (item) => {
        dispatchStories({ payload: item, type: "REMOVE_STORY" });
    };

    return (
        <div className="App">
            <h1>My Hacker Stories</h1>
            <InputWithLabel id="search" label="Search: " onInputChange={handleChange} defaultValue={searchTerm}>
                <strong>Search:</strong>
            </InputWithLabel>
            <hr />
            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? <>Loading...</> : <List list={stories.data} onRemoveStory={handleRemoveStory} />}
        </div>
    );
};

export default App;
