import React, { Component } from 'react';
import MovieSearchBar from './MovieSearchBar';
import SearchResult from './SearchResult';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './MovieSearchBar.css';
import { Link } from "react-router-dom";


const baseURL = `http://localhost:3001`;
class MovieSearchPage extends Component {
  constructor () {
    super();
    this.state = {
      searchResults: [],
      rentalAddedMessage: false,
      rentalToAdd: {},
      addRentalsLink: false,
    }
  };

  submitSearchQuery = (searchTerm) => {
    
    const formattedTerm = searchTerm.replace(' ', '%20') ;
    Axios.get(`${baseURL}/movies?query=${formattedTerm}`)
      .then((response) => {
        const results = response.data;
        this.setState({ 
          searchResults: results,
          success: `Found ${response.data.length} movies matching "${searchTerm}"`,
          addRentalsLink: false, })
        })
      .catch((error) => {
          this.setState({ error: error.message });
        });
  };

  addRental = (movieData) => {
    const rental = {
      title: movieData.title,
      overview: movieData.overview,
      release_date: movieData.release_date,
      image_url: movieData.image_url,
      external_id: movieData.external_id
    };

    Axios.post(`${baseURL}/movies`, rental)
    .then((response) => {
      this.setState({ 
        success: `Successfully added ${rental.title} to the library.`,
        addRentalsLink: true,
      })
    })
  }

  render() {
    const {searchResults} = this.state;
    const resultList = searchResults.map((result) => {
      const {external_id, title, overview, release_date, image_url} = result;
      return ( <SearchResult 
              key={external_id} 
              title={title}
              overview={overview} 
              release_date={release_date} 
              image_url={image_url}
              external_id={external_id}
              onSelectHandler={this.addRental} />)
    });

    const errorSection = (this.state.error) ? 
    (<section className="alert alert-danger">
       Error: {this.state.error}
     </section>) : null;

    const successSection = (this.state.success) ? 
    (<section className="alert alert-success">
      <p>
      {this.state.success} 
      </p>
    </section>) 
    : null;

    const libraryLink  = (this.state.addRentalsLink) ? 
    (<section className="alert alert-success"> 
    <Link to="/library">Go to rental library</Link>
    </section>) : null; 

    return (
    <section>
      {errorSection}
      {successSection}
      {libraryLink}
      <div>
        <MovieSearchBar searchCallback={this.submitSearchQuery} />
      </div>
      <div className="table-container">
        <table className="table table-striped">
          <thead>
          <tr>
            <th></th>
            <th scope="col">Title</th>
            <th scope="col">Overview</th>
            <th scope="col">Release Date</th>
          </tr>
          </thead>
          <tbody>
            {resultList}
          </tbody>
        </table>
      </div>
    </section>
    );
  }
}

export default MovieSearchPage;