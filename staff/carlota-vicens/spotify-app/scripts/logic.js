var logic = {
    token: 'BQB-AUIdYY6v0onJH5fwc0mS_vr5ggVkAhOGyzxjLG2jwslKkLW1tYP4AwOprabD7Yxe-6-Yd91LfSj9UHJim3WLKtCCEuuKAtNCl4XBxpnmvrIznCcnD48nXEG3DuYeqXFCOZhpG_Q',

    _callApi: function (path) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var res = JSON.parse(request.responseText);

                        resolve(res);
                    } else reject(Error('request error, status ' + request.status));
                }
            };

            var url = 'https://api.spotify.com/v1' + path;

            request.open('get', url);

            request.setRequestHeader('Authorization', 'Bearer ' + this.token);


            request.send();
        }.bind(this));

    },

    searchArtists: function (query) {
        return this._callApi('/search?type=artist&query=' + query)
            .then(function(res) {
                return res.artists.items;
            });
    },

    retrieveAlbumsByArtistId(id) {
        return this._callApi('/artists/' + id + '/albums')
            .then(function(res) {
                return res.items;
            });
    },

    retrieveTracksByAlbumId(id) {
        // TODO
        return this._callApi('/albums/' + id +'/tracks')
        
            .then(function (res){
                return res.items;
            });
    },

    retrieveTrackById(id) {
        // TODO
        return this._callApi('/tracks/' + id)
            .then (function(res){
                return res;
            });
    }
};