(ns enso.core
  (:require [quil.core :as q :include-macros true]
            [quil.middleware :as m]))

(defn polar [r phi]
  (let [mid-x (/ (q/width) 2)
        mid-y (/ (q/height) 2)]
    [(+ mid-x (* r (q/cos phi)))
     (+ mid-y (* r (q/sin phi)))]))

(defn setup []
  ; Set frame rate to 30 frames per second.
  (q/frame-rate 90)
  ; Set color mode to HSB (HSV) instead of default RGB.
  (q/color-mode :hsb)
  ; setup function returns initial state. It contains
  ; circle color and position.
  {
   :start-time (.getTime (js/Date.))
   :shader (q/load-shader "shader/metaball.frag" "shader/metaball.vert")
   :positions []
   :radii []
   :threshold 0.45})

(defn frag-mouse-coords []
  [(q/map-range (q/mouse-x) 0 (q/width)
                0 (* 2 (q/width)))
   (q/map-range (q/mouse-y) 0 (q/height)
                (* 2 (q/height)) 0)])


(defn push-shader-env! [shader]
  (let [resolution (array (q/width) (q/height))
        frag-mouse (apply array (frag-mouse-coords))]
    (q/set-uniform shader "u_resolution" resolution)
    (q/set-uniform shader "u_mouse" frag-mouse)))

(defn push-metaballs! [shader positions radii threshold]
  (q/set-uniform shader "u_threshold" threshold)
  (q/set-uniform shader "u_num_metaballs" (count positions))
  (doseq [[i pos radius] (map vector (range) positions radii)]
    (q/set-uniform shader (str "u_metaball_pos_" i)
                   (array (float (pos 0)) (float (pos 1))))
    (q/set-uniform shader (str "u_metaball_radius_" i) (float radius))))

(defn update-state [state]
  (let [time (- (.getTime (js/Date.)) (:start-time state))]
    (merge state
           {:time time
            :positions [(frag-mouse-coords) [200 200] [1024 1024] [0 0]]
            :radii [0.1 0.1 0.1 0.1]
            :threshold 0.40})))

(defn draw-state [{:keys [time shader positions radii threshold] :as state}]
  (push-shader-env! shader)
  (push-metaballs! shader positions radii threshold)
  (when (q/loaded? shader)
    (q/shader shader)
    (q/rect 0 0 (q/width) (q/height))))
  ;; (slow-render-colors (:presence state)))


; this function is called in index.html
(defn ^:export run-sketch []
  (q/defsketch enso
    :host "enso"
    :size [1024 1024]
    :setup setup
    ; update-state is called on each iteration before draw-state.
    :update update-state
    :draw draw-state
    :renderer :p3d
    ; This sketch uses functional-mode middleware.
    ; Check quil wiki for more info about middlewares and particularly
    ; fun-mode.
    :middleware [m/fun-mode]))

; uncomment this line to reset the sketch:
;; (run-sketch)

(defn render-colors
  [colors]
  (let [disp-density (q/display-density)
        width (count (colors 0))
        height (count colors)
        pixels (q/pixels)]
    (doseq [y (range height)
            x (range width)
            d-i (range disp-density)
            d-j (range disp-density)]
      (let [color ((colors y) x)
            index (* 4 (+ (* (+ (* y disp-density)
                                d-j)
                             width
                             disp-density)
                          (+ (* x disp-density)
                             d-i)))]
        (aset pixels (+ index 0) color)
        (aset pixels (+ index 1) color)
        (aset pixels (+ index 2) color)
        (aset pixels (+ index 3) 255))) 
    (q/update-pixels)))

(defn slow-render-colors
  [colors]
  (doseq [y (range (count colors))
          x (range (count (colors 0)))]
    (let [color ((colors y) x)]
      (q/set-pixel x y (q/color (* 255 color) 255))))
  (q/update-pixels))

(def metaball-radius 2000)

(defn square [x]
  (* x x))

(defn slow-px-single-metaball-density
  [[x y] [metaball-x metaball-y]]
  (/ metaball-radius (+ (square (- x metaball-x))
                        (square (- y metaball-y))
                        1)))

(defn fast-px-single-metaball-density
  [[x y] [metaball-x metaball-y]]
  (let [squared-dist (+ (square (- x metaball-x))
                        (square (- y metaball-y)))]
   (square (- 1 squared-dist))))

(defn px-metaball-density
  "Returns the metaball density of pixel (x, y) given metaballs at positions."
  [[x y] positions]
  (apply +
         (mapv slow-px-single-metaball-density (repeat [x y]) positions)))

(defn metaball-density
  "Returns the metaball density for each pixel in the canvas as a 2d array given metaballs at positions."
  [positions]
  (let [width (q/width)
        height (q/height)]
    (into []
          (for [x (range width)]
            (into []
                  (for [y (range height)]
                    (px-metaball-density [x y] positions)))))))

(defn metaball-presence
  [density]
  (mapv
   (fn [row]
     (mapv (fn [px-density] (if (< 0.50 px-density)
                             0.1
                             1.0))
      row))
   density))
