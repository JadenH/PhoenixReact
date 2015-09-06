import React              from 'react';
import Router             from 'react-router';
import routes             from './routes';

localStorage.setItem('jwt', "asdfsd");


describe('default route', function () {

  it('renders home', function (done) {
    var rootSlashLocation = new Router.TestLocation(['/']);
    Router.run(routes, rootSlashLocation, function (Handler, state){
      var html = React.renderToString(<Handler params={state.params} />);
      expect(html).toBeDefined();
      done();
    });
  });

});
