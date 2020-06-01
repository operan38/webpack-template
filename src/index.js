import $ from 'jquery';
import Post from './Post';
import './css/styles.css';
import './scss/styles.scss';
import './img/1.png';

$('h1').html('test');

async function start() {
    return await Promise.resolve('test');
}

start().then(res => console.log(res));

const post = new Post('webpack post title');
console.log('post to string', post.toString());