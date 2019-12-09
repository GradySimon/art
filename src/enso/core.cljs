(ns enso.core
  (:require [three]))

(def THREE js/THREE)

(defn init-scene [{:keys [scene] :as state}]
  (let [geom (THREE.BoxGeometry. 1 1 1)
        mat (THREE.MeshBasicMaterial. #js {"color" 0x00ff00})
        cube (THREE.Mesh. geom mat)]
    (.add scene cube)
    (assoc-in state [:meshes :cube] cube)))

(defn init-camera [{:keys [camera] :as state}]
  (set! camera.position.z 5)
  state)

(defn init []
  (let [
        [width height] [js/window.innerWidth js/window.innerHeight]
        aspect-ratio (/ width height)
        state {:scene (THREE.Scene.)
               :camera (THREE.PerspectiveCamera.
                        75  ; FOV, in degrees
                        aspect-ratio
                        0.1 ; Near clipping plane
                        1000) ; Far clipping plane
               :renderer (THREE.WebGLRenderer.)
               :meshes {}}]
    (.setSize (:renderer state) width height)
    (js/document.body.appendChild (.-domElement (:renderer state)))
    (-> state
        init-scene
        init-camera)))

(defn update-state [state]
  (let [cube (get-in state [:meshes :cube])]
    (set! (.-x (.-rotation cube)) (+ 0.01 (.-x (.-rotation cube))))
    (set! (.-y (.-rotation cube)) (+ 0.01 (.-y (.-rotation cube)))))
  state)

(defn animate [{:keys [scene camera renderer] :as state}]
  (.render renderer scene camera)
  (println state)
  (let [next-state (update-state state)]
    (js/requestAnimationFrame #(animate next-state))))

(defn main []
  (println "Running enso.core/main")
  (let [state (init)]
    (animate state)))

