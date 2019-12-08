(ns enso.core
  (:require [three]))

(def THREE js/THREE)

(defn prep-scene [scene]
  (let [geom (THREE.BoxGeometry. 1 1 1)
        mat (THREE.MeshBasicMaterial. #js {"color" 0x00ff00})
        cube (THREE.Mesh. geom mat)]
    (.add scene cube)))

(defn prep-camera [camera]
  (set! camera.position.z 5))

(defn init []
  (let [scene (THREE.Scene.)
        [width height] [js/window.innerWidth js/window.innerHeight]
        aspect-ratio (/ width height)
        camera (THREE.PerspectiveCamera.
                75  ; FOV, in degrees
                aspect-ratio
                0.1 ; Near clipping plane
                1000) ; Far clipping plane
        renderer (THREE.WebGLRenderer.)]
    (.setSize renderer width height)
    (js/document.body.appendChild renderer.domElement)
    (prep-scene scene)
    (prep-camera camera)
    [scene camera renderer]))


(defn animate [scene camera renderer]
  (js/requestAnimationFrame #(animate scene camera renderer))
  (.render renderer scene camera))

(defn main []
  (println "Hello, world!")
  (println js/THREE)
  (let [[scene camera renderer] (init)]
    (animate scene camera renderer)))

