/* 

To use you need to have 
 - a github project
 - a Personal Access token via https://github.com/settings/tokens with scope repo
 - a form link and the spreadsheet associated

Step 0:
 Make sure you have associate the script to the spreadsheet

Step 1:
 Update the variables YOUR_USERNAME, YOUR_REPO, GITHUB_KEY

Step 2:
 You need then to update the trigger -> Edit > Current project's triggers
 Add a trigger:
  Choose which function to run: onFormSubmit
  Select event source: From Spreadsheet
  Select event type: On Form submit

Step 3:
 Test the form

Adapted from script: https://script.google.com/d/1jI_BpCFqKstGFQ8sNY8nJwjOiXXhubKDvD7G9h6U1iE63mzX2e4U-ak_/edit?usp=sharing
This example code has been put together by Martin Hawksey https://mashe.hawksey.info. Free to reuse as you like

TODO: Create a function to create a branch
*/

PropertiesService.getScriptProperties().setProperty('YOUR_USERNAME', 'renedeanda');
PropertiesService.getScriptProperties().setProperty('YOUR_REPO', 'viet.io');
PropertiesService.getScriptProperties().setProperty('GITHUB_KEY', 'XXXXX');



function onFormSubmit(e) {
    Logger.log(JSON.stringify(e));
    var company_info = createJson(e.values);
    var file_content = JSON.stringify(company_info);


    commitSingleFileToGithub('gform', 'public/data/companies/' + company_info.slug + '.json', file_content)
}

function createJson(value) {

    return {
        "name": value[2],
        "slug": slugify(value[2]),
        "website": value[3] ,
        "industry": value[4],
        "tagline": value[5],
        "logoUrl": value[6],
        "description": value[7],
        "facebook": value[8],
        "linkedin": value[9],
        "blogUrl": value[10],
        "androidUrl": value[11],
        "iosUrl": value[12],
        "demoUrl": value[13]
    }
}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Committing (creating/updating) a single file to github. 
 * See https://developer.github.com/v3/repos/contents/#create-a-file
 * and https://developer.github.com/v3/repos/contents/#update-a-file
 */
function commitSingleFileToGithub( branch, file_path, content) {
  // set the repository wrapper
  user_name = PropertiesService.getScriptProperties().getProperty('YOUR_USERNAME')
  repo = PropertiesService.getScriptProperties().getProperty('YOUR_REPO')
  
  Github.setRepo(user_name , repo); 

  try { // if file exists need to get it's sha and update instead
    var resp = Github.Repository.createFile(branch, file_path, content, "create file: " + file_path );
  } catch(e) {
    var git_file_obj = Github.Repository.getContents({ref: branch}, file_path);
    resp = Github.Repository.updateFile(branch, file_path, content, git_file_obj.sha, "Update file: " + file_path);
  }

  return resp
}



/*

Following code ported from https://github.com/michael/github
 .... could be ported to a Github Library for Google Apps Script

Copyright (c) 2012 Michael Aufreiter, Development Seed
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.
- Neither the name "Development Seed" nor the names of its contributors may be
  used to endorse or promote products derived from this software without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
var Github = (function() {
    var BASEURL_ = 'https://api.github.com';
    var tokenService_;
    var __fullname,__user;
    var self_ = this;


    function setRepo(service) {
        tokenService_ = service;
    }

    function testTokenService() {
        return tokenService_();
    }

    /**
     * Make a request.
     * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
     * @param {string} path - the path for the request
     * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
     *                   will be sent as query parameters
     * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
     *                              request will be made as JSON
     * @return {Response} - the Response for the http request
     */
    function _request(method, path, data, raw) {
        var url = __getURL(path);
        var queryParams = {};

        var config = {
                    method: method,
                    muteHttpExceptions: true,
                    contentType: "application/json",
                    headers: {
                        Authorization: "Bearer " + PropertiesService.getScriptProperties().getProperty('GITHUB_KEY')
                    },
                    responseType: raw ? 'text' : 'json'
                }
        var shouldUseDataAsParams = data && (typeof data === 'object') && methodHasNoBody(method);
        
        if (shouldUseDataAsParams) {
            url = buildUrl_(url, data);
        } else if (data !== null) {
          config.payload = JSON.stringify(data);
        }
        Logger.log("Github request ... " + url + " config: "+JSON.stringify(config));
        var response = UrlFetchApp.fetch(url, config)
        
        if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
            return JSON.parse(response.getContentText());
        } else {
            throw new Error(response.getContentText());
        }
    }

    /**
     * Compute the URL to use to make a request.
     * @private
     * @param {string} path - either a URL relative to the API base or an absolute URL
     * @return {string} - the URL to use
     */
    function __getURL(path) {
        var url = path;

        if (path.indexOf('//') === -1) {
            url = BASEURL_ + path;
        }
        return url;
    }

    // ////////////////////////// //
    //  Private helper functions  //
    // ////////////////////////// //
    var METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];

    function methodHasNoBody(method) {
        return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
    }

    /**
     * Performs a Fetch and accumulation using pageToken parameter of the returned results
     * @param {string} url The endpoint for the URL with parameters
     * @param {Object.<string, string>} options Options to override default fetch options
     * @param {string} returnParamPath The path of the parameter to be accumulated
     * @returns {Array.Object.<string,string>} An array of objects
     * @private
     */
    function _requestAllPages(method, path, data) {
        var url = __getURL(path);
        var queryParams = {};

        var config = {
                    method: "GET",
                    muteHttpExceptions: true,
                    contentType: "application/json",
                    headers: {
                        Authorization: "Bearer "  + PropertiesService.getScriptProperties().getProperty('GITHUB_KEY')
                    }
                }
        var shouldUseDataAsParams = data && (typeof data === 'object') && methodHasNoBody(method);
        if (shouldUseDataAsParams) {
            url = buildUrl_(url, data);
        } else if(data !== null) {
          config.payload = JSON.stringify(data);
        }
        
        var returnArray = [];
        var nextPageToken;
        do {
            if (nextPageToken) {
                url += "?pageToken=" + nextPageToken;
            }
            var results = UrlFetchApp.fetch(url, config);
            if (results.getResponseCode() != 200) {
                throw new Error(results.getContentText());
            } else {
                var resp = JSON.parse(results.getContentText())
                nextPageToken = resp.nextPageToken;
                returnArray = returnArray.concat(resp)
            }

        } while (nextPageToken)

        return returnArray;

    }


    /**
     * Builds a complete URL from a base URL and a map of URL parameters. Adapted from Eric Koleda's OAuth2 Lib.
     * @param {string} url The base URL.
     * @param {Object.<string, string>} params The URL parameters and values.
     * @returns {string} The complete URL.
     * @private
     */
    function buildUrl_(url, params) {
        var params = params || {}; //allow for NULL options
        var paramString = Object.keys(params).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
    }

    /**
     * Create a new Repository wrapper
     * @param {string} user - the user who owns the respository
     * @param {string} repo - the name of the repository
     * @return {Repository}
     */
    function setRepo(user, repo) {
        __fullname = getFullName_(user, repo);
    }

    /**
     * Computes the full repository name
     * @param {string} user - the username (or the full name)
     * @param {string} repo - the repository name, must not be passed if `user` is the full name
     * @return {string} the repository's full name
     */
    function getFullName_(user, repo) {
        var fullname = user;

        if (repo) {
            fullname = user + '/' + repo;
        }

        return fullname;
    }
    
    /**
    * Create a new User wrapper
    * @param {string} user - the user who in authenticated
    */
    function setUser(user) {
      __user = user;
    }
    
    /**
    * Sets the default options for API requests
    * @protected
    * @param {Object} [requestOptions={}] - the current options for the request
    * @return {Object} - the options to pass to the request
    */
   function _getOptionsWithDefaults(requestOptions) {
     requestOptions = requestOptions ? requestOptions : {};
      if (!(requestOptions.visibility || requestOptions.affiliation)) {
         requestOptions.type = requestOptions.type || 'all';
      }
      requestOptions.sort = requestOptions.sort || 'updated';
      requestOptions.per_page = requestOptions.per_page || '100'; // eslint-disable-line

      return requestOptions;
   }
    
    
    /**
     * User Objects
     */
    self_.User = function() {};
    

    
    /**
    * Get the url for the request. (dependent on if we're requesting for the authenticated user or not)
    * @private
    * @param {string} endpoint - the endpoint being requested
    * @return {string} - the resolved endpoint
    */
   function __getScopedUrl(endpoint) {
      if (__user) {
         return endpoint ?
            Utilities.formatString('/users/%s/%s', __user, endpoint) :
            Utilities.formatString('/users/%s',__user);

      } else { // eslint-disable-line
         switch (endpoint) {
            case '':
               return '/user';

            case 'notifications':
            case 'gists':
               return '/' + endpoint;

            default:
               return '/user/' + endpoint;
         }
      }
     }
     
     /**
     * List the user's repositories
     * @see https://developer.github.com/v3/repos/#list-user-repositories
     * @param {Object} [options={}] - any options to refine the search
     * @return {Promise} - the promise for the http request
     */
     self_.User.listRepos = function (options) {
       if (typeof options === 'function') {
         options = {};
       }
       
       options = _getOptionsWithDefaults(options);
       
       return _requestAllPages('GET', __getScopedUrl('repos'), options);
     }
     
     /**
      * Show the user's profile
      * @see https://developer.github.com/v3/users/#get-a-single-user
      * @return {Promise} - the promise for the http request
      */
     self_.User.getProfile = function () {
        return _request('GET', __getScopedUrl(''), null);
     }
     
    /**
     * Repository Objects
     */
    self_.Repository = function() {};

    /**
     * Get a reference
     * @see https://developer.github.com/v3/git/refs/#get-a-reference
     * @param {string} ref - the reference to get
     * @return {Promise} - the promise for the http request
     */
    self_.Repository.getRef = function(ref) {
      return _request('GET', Utilities.formatString('/repos/%s/git/refs/%s', __fullname, ref));
    };
    
   /**
    * Get a commit from the repository
    * @see https://developer.github.com/v3/repos/commits/#get-a-single-commit
    * @param {string} sha - the sha for the commit to fetch
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.getCommit = function(sha) {
      return _request('GET', Utilities.formatString('/repos/%s/git/commits/%s', __fullname, sha));
   }
   
   /**
    * Create a new tree in git
    * @see https://developer.github.com/v3/git/trees/#create-a-tree
    * @param {Object} tree - the tree to create
    * @param {string} baseSHA - the root sha of the tree
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.createTree = function(tree, baseSHA) {
      return _request('POST',  Utilities.formatString('/repos/%s/git/trees', __fullname) , {
        tree:tree, 
        base_tree: baseSHA
      });
   }
   
   /**
    * Add a commit to the repository
    * @see https://developer.github.com/v3/git/commits/#create-a-commit
    * @param {string} parent - the SHA of the parent commit
    * @param {string} tree - the SHA of the tree for this commit
    * @param {string} message - the commit message
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.commit = function(parent, tree, message) {
      var data = {
         message: message,
         tree: tree,
         parents: [parent]
      };

      return _request('POST', Utilities.formatString('/repos/%s/git/commits', __fullname), data);
   }
   
   /**
    * Update a ref
    * @see https://developer.github.com/v3/git/refs/#update-a-reference
    * @param {string} ref - the ref to update
    * @param {string} commitSHA - the SHA to point the reference to
    * @param {boolean} force - indicates whether to force or ensure a fast-forward update
    * @param {Requestable.callback} cb - will receive the updated ref back
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.updateHead = function(ref, commitSHA, force) {
      return _request('PATCH', Utilities.formatString('/repos/%s/git/refs/%s', __fullname, ref), {
         sha: commitSHA,
         force: force
      });
   }

    /**
     * Get the contents of a repository
     * @see https://developer.github.com/v3/repos/contents/#get-contents
     * @param {string} ref - the ref to check
     * @param {string} path - the path containing the content to fetch
     * @param {boolean} raw - `true` if the results should be returned raw instead of GitHub's normalized format
     * @return {Promise} - the promise for the http request
     */
    self_.Repository.getContents = function(ref, path, raw) {
      path = path ? encodeURI(path) : '';
      return _request('GET', Utilities.formatString('/repos/%s/contents/%s', __fullname, path), ref, raw);
    }

    /**
     * Get the contents of by url
     * @see https://developer.github.com/v3/repos/contents/#get-contents
     * @param {string} url - full url of file
     * @return {Promise} - the promise for the http request
     */
    self_.Repository.getContentsByUrl = function(url) {
        return Utilities.newBlob(Utilities.base64Decode(_request('GET', url).content)).getDataAsString();
    }
   
   /**
    * Get a raw blob from the repository
    * @see https://developer.github.com/v3/git/blobs/#get-a-blob
    * @param {string} sha - the sha of the blob to fetch
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.getBlob = function(sha) {
      return _request('GET', Utilities.formatString('/repos/%s/git/blobs/%s', __fullname, sha));
   }
   
   /**
    * Create a blob
    * @see https://developer.github.com/v3/git/blobs/#create-a-blob
    * @param {(string|Buffer|Blob)} content - the content to add to the repository
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.createBlob = function(content) {
      var postBody = _getContentObject(content);
      Logger.log('sending content', postBody);
      return _request('POST', Utilities.formatString('/repos/%s/git/blobs', __fullname), postBody);
   }
   
   /**
    * Create a file to the repository
    * @see https://developer.github.com/v3/repos/contents/#update-a-file
    * @param {string} branch - the name of the branch
    * @param {string} path - the path for the file
    * @param {string} content - the contents of the file
    * @param {string} message - the commit message
    * @param {Object} [options] - commit options
    * @param {Object} [option.sha] - the sha of a file to update
    * @param {Object} [options.name] - the author of the commit
    * @param {Object} [options.email] - the email of the committer
    * @param {boolean} [options.encode] - true if the content should be base64 encoded
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.createFile = function(branch, path, content, message, options) {
      options = options || {}
      var filePath = path ? encodeURI(path) : '';
      var shouldEncode = options.encode || true;
      var commit = {
         branch: branch,
         message: message,
         content: shouldEncode ? Utilities.base64Encode(content) : content
      }; 
      
      if (options.name && options.email) {
        commit.committer = {name: options.name,
                            email: options.email};
      }
      
      if (options.sha) {
        commit.sha = options.sha;
      }
      return _request('PUT', Utilities.formatString('/repos/%s/contents/%s', __fullname, path), commit);
   }
   
   /**
    * Update a file to the repository
    * @see https://developer.github.com/v3/repos/contents/#update-a-file
    * @param {string} branch - the name of the branch
    * @param {string} path - the path for the file
    * @param {string} content - the contents of the file
    * @param {string} message - the commit message
    * @param {Object} [options] - commit options
    * @param {Object} [option.sha] - the sha of a file to update
    * @param {Object} [options.name] - the author of the commit
    * @param {Object} [options.email] - the email of the committer
    * @param {boolean} [options.encode] - true if the content should be base64 encoded
    * @return {Promise} - the promise for the http request
    */
   self_.Repository.updateFile = function(branch, path, content, sha, message, options) {
      options = options || {}
      var filePath = path ? encodeURI(path) : '';
      var shouldEncode = options.encode || true;
      var commit = {
         branch: branch,
         sha: sha,
         message: message,
         content: shouldEncode ? Utilities.base64Encode(content) : content
      }; 
      
      if (options.name && options.email) {
        commit.committer = {name: options.name,
                            email: options.email};
      }
      
      return _request('PUT', Utilities.formatString('/repos/%s/contents/%s', __fullname, path), commit);
   }
   
   
   
   /**
    * Get the object that represents the provided content
    * @param {string|Buffer|Blob} content - the content to send to the server
    * @return {Object} the representation of `content` for the GitHub API
    */
   function _getContentObject(content) {
      Logger.log(typeof content);
      if (typeof content === 'string') {
         Logger.log('content is a string');
         return {
            content: content,
            encoding: 'utf-8'
         };

      } else {
        return {
              content: Utilities.base64Encode(content),
              encoding: 'base64'
           };
      }
      
      /*else if (typeof Buffer !== 'undefined' && content instanceof Buffer) {
         Logger.log('We appear to be in Node');
         return {
            content: content.toString('base64'),
            encoding: 'base64'
         };

      } else if (typeof Blob !== 'undefined' && content instanceof Blob) {
         Logger.log('We appear to be in the browser');
         return {
            content: Utilities.base64Encode(content),
            encoding: 'base64'
         };

      } else { // eslint-disable-line
         Logger.log(Utilities.formatString('Not sure what this content is: %s, %s'), content, JSON.stringify(content));
         throw new Error('Unknown content passed to postBlob. Must be string or Buffer (node) or Blob (web)');
      }*/
   }

    return {
        setRepo: setRepo,
        setUser: setUser,
        User: User,
        Repository: Repository,
    }

})()
