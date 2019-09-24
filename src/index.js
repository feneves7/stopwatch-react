import React, { Component } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dom } from "@fortawesome/fontawesome-svg-core";

import {
  faStop,
  faPlay,
  faHistory,
  faList,
  faStopwatch
} from "@fortawesome/free-solid-svg-icons";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const swal = withReactContent(Swal);
dom.watch();

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      milliseconds: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      stopped: true,
      partials: [],
      title: "Stopwatch"
    };
  }

  resetTimer() {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, run!"
      })
      .then(result => {
        if (result.value) {
          this.state.milliseconds = 0;
          this.state.seconds = 0;
          this.state.minutes = 0;
          this.state.hours = 0;
          this.state.partials = [];
          this.state.stopped = true;
        }
      });
  }

  breakTimer(state) {
    this.state.stopped = state;
  }

  partialTimer() {
    this.state.partials.push(
      <Datatable
        hours={this.state.hours}
        minutes={this.state.minutes}
        seconds={this.state.seconds}
        milliseconds={this.state.milliseconds}
      />
    );
    const Toast = swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "success",
      title: "Partial add in successfully"
    });
  }

  render() {
    const resetMilliseconds = () => {
      this.setState({
        milliseconds: 0
      });
    };

    const resetSecond = () => {
      this.setState({
        seconds: 0
      });
    };

    const resetMinute = () => {
      this.setState({
        minutes: 0
      });
    };

    const updateSeconds = () => {
      this.setState(state => {
        return { seconds: state.seconds + 1 };
      });
    };

    const updateMinutes = () => {
      this.setState(state => {
        return { minutes: state.minutes + 1 };
      });
    };

    const updateHours = () => {
      this.setState(state => {
        return { hours: state.hours + 1 };
      });
    };

    const addMili = () => {
      this.setState(function(state, props) {
        if (this.state.milliseconds >= 999) {
          resetMilliseconds();
          updateSeconds();
        }

        if (this.state.stopped === false) {
          return {
            milliseconds: state.milliseconds + 1
          };
        } else {
          return {
            milliseconds: state.milliseconds
          };
        }
      });
    };
    const addTimer = () => {
      this.setState(function(state, props) {
        if (this.state.seconds == 60) {
          resetSecond();
          updateMinutes();
        }

        if (this.state.minutes == 60) {
          resetMinute();
          updateHours();
        }

        if (this.state.stopped === false) {
          return {
            milliseconds: state.milliseconds + 1
          };
        } else {
          return {
            milliseconds: state.milliseconds
          };
        }
      });
    };

    setTimeout(addMili, 1);
    setTimeout(addTimer, 1000);

    return (
      <div class="col-12 text-center">
        <Title
          title={<FontAwesomeIcon icon={faStopwatch} />}
          subtitle={this.state.title}
        />

        <div class="mb-4 p-4">
          <Button
            className={[
              "rounded-circle",
              "btn-warning",
              this.state.milliseconds == 0 ? "disabled" : ""
            ].join(" ")}
            onClick={this.state.milliseconds > 0 ? () => this.resetTimer() : ""}
            label={<FontAwesomeIcon icon={faHistory} />}
            title={"Restart"}
          />

          <Button
            className={[
              "rounded-circle",
              this.state.stopped ? "btn-success" : "btn-danger"
            ].join(" ")}
            onClick={
              this.state.stopped
                ? () => this.breakTimer(false)
                : () => this.breakTimer(true)
            }
            label={
              this.state.stopped ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <FontAwesomeIcon icon={faStop} />
              )
            }
            title={[this.state.stopped ? "Play" : "Stop"]}
          />

          <Button
            className={["rounded-circle", "btn-info"].join(" ")}
            onClick={() => this.partialTimer()}
            label={<FontAwesomeIcon icon={faList} />}
            title={"Partial"}
          />
        </div>
        <div class="mb-4">
          <Stopwatch
            hours={this.state.hours}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
            milliseconds={this.state.milliseconds}
          />
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-3" />
          <div class="col-6">
            <Partialtable datatable={this.state.partials} />
          </div>
          <div class="col-3" />
        </div>
      </div>
    );
  }
}

const Button = ({ className, onClick, label, stopped, title }) => (
  <button
    class={["btn", "btn-lg", "ml-2", className, stopped ? "disabled" : ""].join(
      " "
    )}
    onClick={onClick}
    title={title}
  >
    {label}
  </button>
);

const Stopwatch = ({ hours, minutes, seconds, milliseconds }) => (
  <div class="container">
    <div class="h2 text-center mb-4">
      <strong class="rounded-circle text-danger bg-light p-3">
        {hours >= 10 ? hours : "0" + hours}
      </strong>
      <small class="text-value">:</small>
      <strong class="rounded-circle text-danger bg-light p-3">
        {minutes >= 10 ? minutes : "0" + minutes}
      </strong>
      <small class="text-value">:</small>
      <strong class="rounded-circle text-danger bg-light p-3">
        {seconds >= 10 ? seconds : "0" + seconds}
      </strong>
      <small class="text-value">:</small>
      <strong class="rounded-circle text-danger bg-light p-3">
        {milliseconds >= 10 ? milliseconds : "0" + milliseconds}
      </strong>
    </div>
  </div>
);

const Title = ({ title, subtitle }) => (
  <div>
    <h1 class="h1 mt-4 display-3">{title}</h1>
    <h4 class="mb-4 font-weight-bold text-muted display-4"> {subtitle} </h4>
  </div>
);

const Datatable = ({ hours, minutes, seconds, milliseconds }) => (
  <tr class="bg-primary">
    <td scope="row">
      <strong>
        {hours >= 10 ? hours : "0" + hours}h<small class="text-value">:</small>
        {minutes >= 10 ? minutes : "0" + minutes}m
        <small class="text-value">:</small>
        {seconds >= 10 ? seconds : "0" + seconds}s
        <small class="text-value">:</small>
        {milliseconds >= 10 ? milliseconds : "0" + milliseconds}ms
      </strong>
    </td>
  </tr>
);

const Partialtable = ({ datatable }) => (
  <div class="container">
    <div class="row">
      <table class="table mt-4 col-12">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Partials</th>
          </tr>
        </thead>
        <tbody>{datatable}</tbody>
      </table>
    </div>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<Timer />, rootElement);
