import ReactSearchBox from 'react-search-box';

const SearchBox = (props) => {
    return(
        <ReactSearchBox
            placeholder="Search for John, Jane or Mary"
            data=''
            onSelect={record => console.log(record)}
            onFocus={() => {
                console.log('This function is called when is focussed')
            }}
            onChange={value => console.log(value)}
            fuseConfigs={{
                threshold: 0.05,
            }}
            value="John"
        />
    );
};

export default SearchBox;