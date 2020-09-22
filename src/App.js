import React from "react";

const List = ({ list }) => {
    return list.map((item) => <Item key={item.objectID} item={item} />);
};

const Item = ({ item }) => (
    <div>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
    </div>
);

const InputWithLabel = ({ id, children, type = "text", searchTerm, onInputChange }) => {
    const handleChange = (event) => {
        onInputChange(event);
    };

    return (
        <div>
            <label htmlFor={id}>{children}</label>
            <input id={id} type={type} value={searchTerm} onChange={handleChange} />
            <p>
                Searching for <strong>{searchTerm}</strong>
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
    const stories = [
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

    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="App">
            <h1>My Hacker Stories</h1>
            <InputWithLabel id="search" label="Search: " onInputChange={handleChange} defaultValue={searchTerm}>
                <strong>Search:</strong>
            </InputWithLabel>
            <hr />
            <List list={searchedStories} />
        </div>
    );
};

export default App;
