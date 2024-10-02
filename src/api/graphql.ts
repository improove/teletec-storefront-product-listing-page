const graphqlEndpoint = `${window.origin}/graphql`;

async function getGraphQL(query = '', variables = {}, store = '') {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Store: store },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());

  return response;
}

async function getGraphQLTest(query = '', variables = {}, store = '', apiUrl: string | undefined = undefined) {
  // console.log(apiUrl);
  // const response = await fetch(graphqlEndpoint, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Store: store },
  //   body: JSON.stringify({
  //     query,
  //     variables,
  //   }),
  // }).then((res) => res.json());
  //
  // return response;


  const response = await fetch(apiUrl ?? graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Store: store, Authorization: 'Bearer eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjE0Mzk2LCJ1dHlwaWQiOjMsImlhdCI6MTcyNTk3NzI5MywiZXhwIjoxNzI1OTgwODkzfQ.7td4uVPQnMDiFLOzeCB1lcrhtMNPA2rOcUDypi9WVk0' },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());

  return response;
}


export { getGraphQL, getGraphQLTest };
