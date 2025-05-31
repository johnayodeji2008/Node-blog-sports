module.exports = (temp, post) => {
    let output = temp.replace(/{%IMAGE%}/g, post.image);
        output = output.replace(/{%ID%}/g, post.id);
        output = output.replace(/{%POST_SECTION%}/g, post.section);
        output = output.replace(/{%POST_TITLE%}/g, post.title);
        output = output.replace(/{%POST_CONTENT%}/g, post.content);

        return output;
}

