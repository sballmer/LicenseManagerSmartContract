require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
              name: 'Zucchini DApp',
              short_name: 'Zucchini',
              icon: 'src/images/zucchini.png',
            },
        },
    ]
}