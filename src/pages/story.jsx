import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Layout from '../components/MyLayout';
import withApollo from '../apollo/client';

const STORY = gql`
  query Story($input: ModelIdInput!) {
    story(input: $input) {
      id
      title
      teaser
      body
    }
  }
`;

const createMarkup = html => ({ __html: html });

const Story = ({ id }) => {
  const input = { id };
  return (
    <Layout>
      <Query query={STORY} variables={{ input }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p><strong>{error.message}</strong></p>;

          const { story } = data;

          return (
            <main>
              <Head>
                <title>{story.title}</title>
                <meta name="description" content={story.teaser} />
              </Head>
              <h1>{story.title}</h1>
              {/* eslint-disable-next-line react/no-danger */}
              <article dangerouslySetInnerHTML={createMarkup(story.body)} />
            </main>
          );
        }}
      </Query>
    </Layout>
  );
};

Story.getInitialProps = async (context) => {
  const { id } = context.query;
  return { id };
};

Story.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withApollo(Story);
