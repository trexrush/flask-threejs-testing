from flask import Flask, render_template
import random

app = Flask(__name__)     


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<name>')
def return_name(name):
    NUM_VARIABLES = 6
    if type(name) != int:
        name = hash(name)
    random.seed(name)
    seeds = [0] * (NUM_VARIABLES + 1)
    seeds[0] = name
    for i in range (NUM_VARIABLES + 1):
        seeds[i] = random.random() # create values from the seed

    return render_template('seed.html', seed = seeds)
    # return "Hello, {}".format(name)


if __name__ == "__main__": # if you use flask.run I think you dont need this
    app.run(debug=True)
