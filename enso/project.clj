(defproject enso "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [org.clojure/clojurescript "1.10.520"]
                 [org.clojure/core.async "0.6.532"]]

  :plugins [[lein-cljsbuild "1.1.7"]
            [lein-figwheel "0.5.19"]]
  :hooks [leiningen.cljsbuild]

  :clean-targets ^{:protect false} ["resources/public/compiled"]
  :cljsbuild
  {:builds [; development build with figwheel hot swap
            {:id "dev"
             :source-paths ["src"]
             :figwheel true
             :compiler
             {:main "enso.core"
              :foreign-libs [{:file "resources/public/js/three_r111.js"
                              :provides ["three"]}]
              :output-to "resources/public/js/compiled/main.js"
              :output-dir "resources/public/js/compiled/dev"
              :asset-path "js/compiled/dev"}}
            ; minified and bundled build for deployment
            {:id "opt"
             :source-paths ["src"]
             :compiler
             {:main "enso.core"
              :foreign-libs [{:file "resources/public/js/three_r111.min.js"
                              :provides ["three"]}]
              :output-to "resources/public/js/compiled/main.js"
              :output-dir "resources/public/js/compiled/opt"
              :asset-path "js/compiled/opt"
              :optimizations :advanced}}]})
