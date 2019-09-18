import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  SearchBox,
  Hits,
  HitsStats,
  SelectedFilters,
  Pagination,
  ResetFilters,
  SearchkitManager,
  SearchkitProvider,
  Layout,
  TopBar,
  LayoutBody,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  SideBar,
  NoHits,
  DynamicRangeFilter
  } from "searchkit";

const NewsHitsListItem = (props) => {
  const {bemBlocks, result} = props

  let url = result._source.external_link;
  const { title, user, age, score, index, writers = [], actors = [], genres = [], plot, released, rated } = result._source;

  const [imageData, setImageData] = useState({ src: 'https://images-na.ssl-images-amazon.com/images/I/41kG%2BQzuHML.jpg' });


  useEffect(() => {
    (async function() {
        try {
            const response = await fetch(
              window.location.origin + '/_image?post=' + url
            );
            const json = await response.json();
            if(json.url !== null && json.url !== undefined && json.url.startsWith('http')){
              setImageData({src: json.url});
            }
        } catch (e) {
            console.error(e);
        }
    })();
  }, []);

  let visible = title !== null && title !== undefined;

  let date = new Date(age);

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        {visible
         ? 
          <div className={bemBlocks.item("poster")}>
            <img data-qa="poster" src={imageData.src} className="poster"/>
          </div>
         :
          <div/> 
         }
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")}>{title}</h2></a>
        {visible
         ?
          <p>
            <small className={bemBlocks.item("subtitle")}>{date.toLocaleDateString("en-US")},
            <a href={'https://news.ycombinator.com/item?id=' + index}  target="_blank">&ensp;comments</a>
            </small>
          </p>
         :
          <div/> 
         }        
        
      </div>
    </div>
  )
}

const searchkit = new SearchkitManager(window.location.origin);


class App extends Component {
  render() {
    return (
     <SearchkitProvider searchkit={searchkit}>
      <Layout>
      <TopBar>
        <SearchBox
          autofocus={true}
          searchOnChange={true}
          prefixQueryFields={["title", "external_link"]}/>
      </TopBar>     

      <LayoutBody>
        <SideBar>          
          <DynamicRangeFilter field="comments" id="comments" title="Comments"/>
          <DynamicRangeFilter field="score" id="score" title="Score"/>
          <DynamicRangeFilter field="age" id="age" title="Days before"
          rangeFormatter={
            (count) => Math.round((new Date().getTime() - count.toFixed(2)) / (1000 * 60 * 60 * 24))
          }/>          
        </SideBar>         
        <LayoutResults>
          <ActionBar>
              <ActionBarRow>
                <HitsStats/>
              </ActionBarRow>
              <ActionBarRow>
                <SelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>          
          </ActionBar>
          <Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={NewsHitsListItem}
              sourceFilter={["title", "user", "external_link", "age", "score", "comments", "index"]}/>
          <NoHits/>
          <Pagination/>
        </LayoutResults>
      </LayoutBody>
      </Layout>
     </SearchkitProvider>
    );
  }
}

export default App;
