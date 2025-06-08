
import tensorflow as tf
from tensorflow import keras

def build_classifier(input_dim, num_classes):
    """
    MLP 분류기
    - input_dim: 입력 피처 개수
    - num_classes: 분류할 클래스 수
    """
    inp = keras.Input(shape=(input_dim,), name="features")
    x = keras.layers.Dense(128, activation="relu")(inp)
    x = keras.layers.Dropout(0.3)(x)
    x = keras.layers.Dense(64, activation="relu")(x)
    x = keras.layers.Dropout(0.2)(x)
    x = keras.layers.Dense(32, activation="relu")(x)
    out = keras.layers.Dense(num_classes, activation="softmax", name="output")(x)
    return keras.Model(inputs=inp, outputs=out, name="mlp_classifier")
