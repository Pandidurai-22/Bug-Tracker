const Home = () => 
        <div className="home-container">
            <h1 className="home-title">Welcome to the Bug Tracker</h1>
            <p className="home-description">Track and manage your bugs efficiently.</p>
            <div className="home-links">
                <a href="/Dashboard" className="home-link">Go to Dashboard</a>
                <a href="/CreateBug" className="home-link">Create a New Bug</a>
            </div>
        </div>
export default Home;