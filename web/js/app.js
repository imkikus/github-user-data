App.controller('home', function(page) {
  var $container = $(page).find('.results');
  $template = $(page).find('.user-details');
  $container.hide();
  var form = page.querySelector('form'),
      input = page.querySelector('form .app-input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if(typeof input.value === 'undefined' || input.value === '') {
      $container.hide();
      $(page).find('.placeholder').show();
      $(page).find('.placeholder .text').text('Please enter the user login name you are looking to search for...');
    } else {
      $(page).find('.placeholder').hide();
      $('.footer').hide();
      $('.loader').show();
      var url = "https://api.github.com/users/"+input.value
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'jsonp',
        success: function(resp) {
          var status = resp.meta.status;
          $(page).find('.user-details').remove();
          if(status === 200) {
            $container.show();
            var $details = $template.clone(true);
            $details.find('.user-image').attr("src", resp.data.avatar_url).error(function() { 
              $(this).attr("src", "https://s18.postimg.org/7occkhwgp/default_thumbnail.jpg");
            });
            var name = (resp.data.name) ? resp.data.name : '--';
            $details.find('.name').text(name);
            $details.find('.login').text(resp.data.login);
            var bio = (resp.data.bio) ? resp.data.bio : '--';
            $details.find('.bio').text(bio);
            var email = (resp.data.email) ? resp.data.email : '--';
            $details.find('.email').text(email);
            var company = (resp.data.company) ? resp.data.company : '--';
            $details.find('.company').text(company);
            $details.find('.followers').text(resp.data.followers);
            $details.find('.following').text(resp.data.following);
            $details.find('.public-gists').text(resp.data.public_gists);
            $details.find('.public-repos').text(resp.data.public_repos);
            var is_admin = resp.data.site_admin;
            var admin_status = is_admin ? 'Yes' : 'No';
            $details.find('.is-admin').text(admin_status);
            $container.append($details);
            $('.loader').hide();
            $('.footer').show();
          } else {
            $('.loader').hide();
            $('.footer').show();
            $(page).find('.placeholder').show();
            $(page).find('.placeholder .text').text('Sorry! couldn\'t find the result matching username "'+input.value+'"');
          }
        },
        error: function(error) {
          App.dialog({
            title: 'Oops!',
            text: 'Action ended in error',
            okbutton: 'OK'
          })
        }
      });
    }
  });
});

try {
  // try to restore previous session
  App.restore();
} catch (err) {
  // else start from scratch
  App.load('home');
}