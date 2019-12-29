import json
from tswift import Song
import re
import random
import requests
from bs4 import BeautifulSoup 


def lambda_handler(event, context):
    print(event)
    song = None
    artist = None
    try:
        song = event['song']
        artist = event['artist']

        print(song, artist)

        if song != None and artist != None:
            lyrics = getLyrics(song, artist)
            ret = {"lyrics": lyrics, "song": song, "artist": artist}
        else:
            raise Exception
    except:
        ret = {"Error": "Missing required params!", "song": song, "artist":artist}
    # ret["headers"] = {
    #     'Content-Type': 'application/json', 
    #     'Access-Control-Allow-Origin': '*' 
    # }
    return ret

def getLyrics(song, artist):
    try:
        s = Song(song,artist)
        if not s.lyrics:
            raise Exception
        return s.lyrics
    except Exception as e:
        try:
            az = AzRequest(song, artist)
            print("searching az lyrics")
            lyrics = az.get_lyrics()
            return lyrics
        except Exception as e:
            print(e)
        return "lyrics not found:/"

class AzRequest:
    def __init__(self, song, artist):
        self.artist = artist
        self.song = song

    def get_lyrics(self):
        HTML_TAGS = ['br','div', 'i']
        confirmation_string = "azlyrics.com content"
        url = self.__get_url()
        request = self.__get(url)
        soup = BeautifulSoup(request.content, 'lxml')
        page_lyric = soup.find_all("div", limit=22)
        page_lyrics = page_lyric[19]
        lyrics = ''.join(page_lyrics.find_all(text=True))
        if confirmation_string in lyrics:
            lyrics = re.findall(r'\S+|\n',lyrics)
            lyrics = [word for word in lyrics if word not in HTML_TAGS]
            return " ".join(lyrics[19:])
        else:
            print("confirmation_string not in lyrics")
            raise Exception

    def __get(self, url, user_agent=True):
        USER_AGENTS = [
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
        'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393'
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36']
        if user_agent:
            return requests.get(url, headers={'User-Agent': random.choice(USER_AGENTS)})
        return requests.get(url)

    def __get_url(self):
        artist = self.artist.lower()
        song_title = self.song.lower()
        artist = re.sub('[^A-Za-z0-9]+', "", artist)
        song_title = re.sub('[^A-Za-z0-9]+', "", song_title)
        if artist.startswith("the"): 
            artist = artist[3:]
        url = "http://azlyrics.com/lyrics/"+artist+"/"+song_title+".html"
        print(url)
        return url