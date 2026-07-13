(ns enso.core
  (:require
    [clojure.core.async :refer [chan go put! >! <!]]
    [three]))

(def THREE js/THREE)

(defn fetch-text [url]
  (go
    (let [text-chan (chan)
          fetch-prom (js/fetch url)]
      (.then fetch-prom (fn [response]
                          (.then (.text response)
                                (fn [text]
                                  (put! text-chan text)))))
      (<! text-chan))))

(defn init-scene [{:keys [scene] :as state}]
  (go
    (let [geom (THREE.PlaneBufferGeometry. 2 2)
          uniforms (clj->js
                    {"u_time" {"type" "f" "value" 0.0}
                     "u_resolution" {"type" "v2" "value" (THREE.Vector2.)}
                     "u_mouse" {"type" "v2" "value" (THREE.Vector2.)}
                     "u_metaball_pos_0" {"type" "v2" "value" (THREE.Vector2. 100 100)}})
          mat (THREE.ShaderMaterial.
               (clj->js
                {"uniforms" uniforms
                 "vertexShader" (<! (fetch-text "shader/metaball.vert"))
                 "fragmentShader" (<! (fetch-text "shader/metaball.frag"))}))

          shader-mesh (THREE.Mesh. geom mat)]
      (.add scene shader-mesh)
      (-> state
          (assoc-in [:meshes :shader-mesh] shader-mesh)
          (assoc-in [:unforms] uniforms)))))

(defn init-camera [{:keys [camera] :as state}]
  (set! camera.position.z 5)
  state)

(defn init []
  (go
    (let [[width height] [js/window.innerWidth js/window.innerHeight]
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
      (-> (<! (init-scene state))
          init-camera))))

(defn update-state [state]
  state)

(defn animate [{:keys [scene camera renderer] :as state}]
  (.render renderer scene camera)
  (println state)
  (let [next-state (update-state state)]
    (js/requestAnimationFrame #(animate next-state))))

(defn main []
  (println "Running enso.core/main")
  (go
    (let [state (<! (init))]
      (animate state))))

