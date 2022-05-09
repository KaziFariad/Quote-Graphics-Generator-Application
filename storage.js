import HandyStorage from 'handy-storage';

function handleStorage(counter) {
	const storage = new HandyStorage({
		beautify: true,
	});
  storage.connect(counter);
  
	storage.setState({
		visited: storage.state.visited || 0,
	});
	storage.setState({
		visited: storage.state.visited + 1,
  });
  
	return storage.state.visited;
}

export default handleStorage;