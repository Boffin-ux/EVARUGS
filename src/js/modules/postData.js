const postData = async cart => {
   try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
         method: 'POST',
         body: JSON.stringify(cart),
         headers: {
            'Content-type': 'application/json; charset=UTF-8',
         },
      });
      const resp = await response.json();
      return resp;
   } catch (err) {
      console.error(err);
   }
};

export default postData;
