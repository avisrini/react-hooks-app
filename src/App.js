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
                remove
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

const App = () => {
    const initialStories = [
        {
            title: "React",
            url: "https://reactjs.org/",
            author: "Jordan Walke",
            num_comments: 3,
            points: 4,
            objectID: 0,
        },
        {
            title: "Redux",
            url: "https://redux.js.org/",
            author: "Dan Abramov, Andrew Clark",
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ];

    const [searchTerm, setSearchTerm] = useSemiPersistentState("lastSearch", "React");
    const [stories, setStories] = React.useState(initialStories);

    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const removeStory = (item) => {
        console.log(item);
        let newStories = stories.filter((story) => story.objectID !== item.objectID);
        setStories(newStories);
    };

    return (
        <div className="App">
            <h1>My Hacker Stories</h1>
            <InputWithLabel id="search" label="Search: " onInputChange={handleChange} defaultValue={searchTerm}>
                <strong>Search:</strong>
            </InputWithLabel>
            <hr />
            <List list={searchedStories} onRemoveStory={removeStory} />
        </div>
    );
};

export default App;
