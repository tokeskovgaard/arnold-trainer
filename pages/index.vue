<template>
  <div class="container">
    <div v-if="exercises.length === 0">{{status}}</div>
    <template v-else>
      <h1 class="header">&#129409;&#128170; Dagens træning &#128293;&#128293;</h1>
      <p>Hver øvelse tages i 3 sæt med 8 reps af samme vægt</p>

      <div class="exercise-container">
        <button v-if="!current()" v-on:click="nopesNewData()" class="new-workout">Hell no! Ny plan</button>
        <div class="exercise-row" v-for="item in exercises">
          <div class="order">{{item.order}}.</div>
          <span class="group">{{item.group}}</span>
          <div class="exercise">{{item.exercise.name}}</div>
          <a class="video" v-if="item.exercise.link" :href="item.exercise.link">&#128250;</a>
          <div class="training">
            <input type="number" size="1" min="0" :step="item.exercise.step" :value="item.exercise.amount"><span>{{item.exercise.units}}</span>
          </div>
        </div>
      </div>

      <template v-if="!current()">
        <button v-on:click="startTraining()">Hell yes! Crunch TIME</button>
      </template>
      <!--      <button v-on:click="saveData()">Gem</button>-->
    </template>
    <template v-if="current()">
      <h2>{{current()}}</h2>
      <button v-on:click="nextPlease()">Næste</button>
    </template>

    <a class="read-more" href="https://www.bodybuilding.com/content/the-full-body-workout-for-extreme-fitness.html">Læs
      mere</a>
    <button v-on:click="crash()">Smash that Exception!</button>
  </div>

</template>

<script lang="ts">
    /*
# TODOS
## Split training log and personal trainer
## Add timer function
## Voice control of next, start, stop, more weight


*/
    import Logo from '~/components/Logo.vue'
    import shuffle from 'lodash/shuffle'
    import Vue from 'vue'
    import * as exercises from '~/static/exercises.json'

    const StorageKey = "TrainingDataStuff";

    interface Exercise {
        group: string,
        name: string
        link: string
        units: string
        step: number
        amount: number
    }

    interface TrainingItem {
        exercise: Exercise,
        order: number
    }


    export default Vue.extend({

        data() {
            const exercises: TrainingItem[] = [];
            const currentExercise: TrainingItem | null = null;
            const trainingLog: { exerciseIndex: number, set: number, timeStarted: Date, timeEnded?: Date }[] = [];
            const status = "loading"
            return {
                status,
                exercises,
                trainingLog,
                currentExercise
            }
        },

        created: function () {
            this.loadData().then(exercises => {
                if (exercises)
                    return exercises;
                return this.createData();
            }).then(exercises => {
                this.saveData(exercises)
                this.exercises = exercises;
                this.status = "loaded"
            }).catch(error => {
                this.status = "Whoops - An error happened :O"
                console.error(error);
            })
        },
        //
        // asyncData: async function ({params}): Promise<string> {
        //     const exerciseItems = await fetch("/exercises.json").then(response => response.json());
        //     return {exerciseItems: exerciseItems}
        //
        // },

        methods: {
            // Should be a computed function.. But dont work atm with the current typescript setup,
            current: function () {
                let trainingLogElement = this.trainingLog[this.trainingLog.length - 1];
                if (!trainingLogElement)
                    return undefined;
                let exercise = this.exercises.find(e => e.order == trainingLogElement.exerciseIndex + 1);
                return {...exercise, ...trainingLogElement};
            },

            nopesNewData: function () {
                this.createData().then(exercises => {
                    this.exercises = exercises;
                    this.saveData(exercises);
                })
            },

            startTraining: function () {
                this.trainingLog.push({exerciseIndex: 0, set: 1, timeStarted: new Date()})
            },

            crash: function () {
                throw Error("BAAAG");
            },

            nextPlease: function () {
                const currentExerciseLog = this.trainingLog[this.trainingLog.length - 1];
                if (!currentExerciseLog) {
                    throw new Error("No active training found");
                }

                if (currentExerciseLog.set < 3) {
                    this.trainingLog.push({
                        exerciseIndex: currentExerciseLog.exerciseIndex,
                        set: currentExerciseLog.set + 1,
                        timeStarted: new Date()
                    });
                    return;
                }
                if (currentExerciseLog.exerciseIndex < 7) {
                    this.trainingLog.push({
                        exerciseIndex: currentExerciseLog.exerciseIndex + 1,
                        set: 1,
                        timeStarted: new Date()
                    });
                    return;
                }
            },

            createData: async function (): Promise<TrainingItem[]> {
                if (process.client) {
                    const items = await fetch("/exercises.json").then(response => response.json());
                    console.log(items);
                    let index = 0;
                    const exercises = shuffle(items).map((exercise: Exercise) => ({
                        group: exercise.group,
                        exercise: exercise,
                        order: ++index
                    }));
                    return exercises;
                }
                return exercises;
            },

            loadData: async function (): Promise<TrainingItem[] | null> {
                if (process.client) {
                    const storageData = window.localStorage.getItem(StorageKey)
                    if (storageData) {
                        return JSON.parse(storageData);
                    }
                }
                return null;
            },

            saveData: function (exercises: TrainingItem[]) {
                if (process.client)
                    window.localStorage.setItem(StorageKey, JSON.stringify(exercises))
            }
        },
        components: {
            Logo
        }
    })
</script>

<style lang="scss">
  :root {
    --background-color: #3b8070;
    --text-color: goldenrod;
    --box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

    color: var(--text-color);
  }

  .new-workout {
    top: 0;
    right: 0;
    position: absolute;
  }

  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: var(--background-color);
  }

  input {
    text-align: right;
    width: 40px;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }

  p,
  .header { margin-bottom: 1rem; }


  .exercise-container {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    box-shadow: var(--box-shadow);
    position: relative;
  }

  .exercise-row {
    display: grid;
    /*padding: 2rem;*/
    grid-template-areas: 'order group exercise video training';
    grid-column-gap: 5px;
    align-items: center;
    justify-content: start;


    .order { grid-area: order; }

    .group { grid-area: group; }

    .exercise { grid-area: exercise; }

    .video { grid-area: video; }

    .training { grid-area: training; }

    .exercise { line-height: 1rem; }

    .group {
      font-size: .6rem;
      background: #3b8070;
      color: white;
      font-weight: bold;
      border-radius: 5px;
      padding: 0 4px 2px;
    }
  }


  .read-more {
    margin-top: 1rem;
    font-size: .6rem;
    color: var(--text-color);
    text-decoration: none;
  }

</style>
