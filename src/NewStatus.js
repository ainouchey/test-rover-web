import React from 'react';
import { Collapsible, Box, Diagram, Clock, Stack, Button, RangeInput, Image, Distribution, Text, Table, TableHeader, TableRow, TableCell, TableBody, ResponsiveContext, Heading, Menu, RadioButtonGroup, TextInput, Form, FormField, Tab, Tabs } from "grommet";
import { Trigger, Subtract, Wifi, Add, StatusCritical, Time } from 'grommet-icons'
import ls from 'local-storage'
import { SettingsGroup, StateBox, MovingGraph, StyledCard, StyledNotification } from './CommonUI'

import wasdDark from './wasd-dark.png';
import arrowDark from './arrow-dark.png';
import wasdLight from './wasd-light.png';
import arrowLight from './arrow-light.png';
import escDark from './esc-dark.png';
import escLight from './esc-light.png';

const value = '';

class NewStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lightMode: false,
            value: '',
        };
    }


    

    render() {
        return <Box justify="center" pad={{ "top": "none", "bottom": "small", "left": "small", "right": "small" }} className="tabContents" animation={{ "type": "fadeIn", "size": "small" }} direction="row" align="stretch" fill hoverIndicator={false}>
              <StyledCard title="System" wide>
                      <StateBox icon={<Trigger size="medium" />} name="Battery" error={(this.props.roverState.status && this.props.roverState.voltage !== undefined && this.props.roverState.voltage <= 13.2) ? 1 : 0} unit="V" value={this.props.roverState.voltage !== undefined ? (Math.round(this.props.roverState.voltage * 100) / 100).toFixed(1) : "-"} />

                    <StateBox
                      icon={<Wifi size="medium" />}
                      name="Signal strength"
                      value={
                        this.props.roverState.rssi
                          ? this.props.roverState.rssi
                          : "-"
                      }
                    />
                    <StateBox
                      icon={<Time size="medium" />}
                      name="On time"
                      value={!this.props.roverState.ontime && "-"}
                    >
                      {this.props.roverState.ontime && (
                        <Clock
                          type="digital"
                          time={this.props.roverState.ontime}
                        />
                      )}
                    </StateBox>
                  </StyledCard>
                  <StyledCard wide>
        <Box justify="center" pad={{ "top": "none", "bottom": "small", "left": "small", "right": "small" }} className="tabContents" animation={{ "type": "fadeIn", "size": "small" }} direction="row" align="stretch" fill hoverIndicator={false}>
            <StyledCard title="Controller State - should not be a box in a box" wide>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box align="center" justify="around" margin={{ "bottom": "small" }} direction="row" wrap={true}>
                            <ControllerDiagram isConnected={this.props.isConnected} roverController={this.props.roverController} />
                            <Box align="start" justify="around" direction="column" wrap={true}>
                                {((this.props.roverController.FR && this.props.roverController.FR.error && this.props.roverController.FR.error !== "Offline") ||
                                    (this.props.roverController.FL && this.props.roverController.FL.error && this.props.roverController.FL.error !== "Offline") ||
                                    (this.props.roverController.RR && this.props.roverController.RR.error && this.props.roverController.RR.error !== "Offline") ||
                                    (this.props.roverController.RL && this.props.roverController.RL.error && this.props.roverController.RL.error !== "Offline")
                                ) && <>
                                        <Heading level={6} margin="xsmall">Clear halting errors:</Heading>
                                        <Box align="start" margin={{"botton": "small"}} justify="evenly" direction="row" wrap={true}>
                                            {this.props.roverController.FR && this.props.roverController.FR.error && this.props.roverController.FR.error !== "Offline" && <Button label="Front R" onClick={(event) => this.clearControllerError(event, 0xD1)} icon={<StatusCritical />} />}
                                            {this.props.roverController.FL && this.props.roverController.FL.error && this.props.roverController.FL.error !== "Offline" && <Button label="Front L" onClick={(event) => this.clearControllerError(event, 0xD2)} icon={<StatusCritical />} />}
                                            {this.props.roverController.RR && this.props.roverController.RR.error && this.props.roverController.RR.error !== "Offline" && <Button label="Rear R" onClick={(event) => this.clearControllerError(event, 0xD3)} icon={<StatusCritical />} />}
                                            {this.props.roverController.RL && this.props.roverController.RL.error && this.props.roverController.RL.error !== "Offline" && <Button label="Rear L" onClick={(event) => this.clearControllerError(event, 0xD4)} icon={<StatusCritical />} />}
                                        </Box>
                                    </>}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell scope="col" border="bottom"></TableCell>
                                            <TableCell scope="col" border="bottom">Status</TableCell>
                                            {(size !== "small" && size !== "xsmall" && <>
                                                <TableCell scope="col" border="bottom">VIN</TableCell>
                                                <TableCell scope="col" border="bottom">Current</TableCell>
                                                <TableCell scope="col" border="bottom">Target Cycle</TableCell>
                                                <TableCell scope="col" border="bottom">Cycle</TableCell>
                                            </>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell scope="row" background={(this.props.roverController.FR && this.props.roverController.FR.error) ? "status-critical" : "none"}>
                                                <strong>Front R</strong>
                                            </TableCell>
                                            <TableCell background={(this.props.roverController.FR && this.props.roverController.FR.error) ? "status-critical" : "none"}>
                                                <strong>{this.props.roverController.FR ? (this.props.roverController.FR.error ? this.props.roverController.FR.error : "OK") : "-"}</strong>
                                            </TableCell>
                                            {(size !== "small" && size !== "xsmall" && <>
                                                <TableCell>{this.props.roverController.FR && this.props.roverController.FR.voltage ? (Math.round(this.props.roverController.FR.voltage * 100) / 100).toFixed(1) : "-"} V</TableCell>
                                                <TableCell>{this.props.roverController.FR && this.props.roverController.FR.current ? this.props.roverController.FR.current : "-"} mA</TableCell>
                                                <TableCell>{this.props.roverController.FR && this.props.roverController.FR.dutyCycleTarget ? this.props.roverController.FR.dutyCycleTarget : "-"}</TableCell>
                                                <TableCell>{this.props.roverController.FR && this.props.roverController.FR.dutyCycle ? this.props.roverController.FR.dutyCycle : "-"}</TableCell>
                                            </>)}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell scope="row" background={(this.props.roverController.FL && this.props.roverController.FL.error) ? "status-critical" : "none"}>
                                                <strong>Front L</strong>
                                            </TableCell>
                                            <TableCell background={(this.props.roverController.FL && this.props.roverController.FL.error) ? "status-critical" : "none"}>
                                                <strong>{this.props.roverController.FL ? (this.props.roverController.FL.error ? this.props.roverController.FL.error : "OK") : "-"}</strong>
                                            </TableCell>
                                            {(size !== "small" && size !== "xsmall" && <>
                                                <TableCell>{this.props.roverController.FL && this.props.roverController.FL.voltage ? (Math.round(this.props.roverController.FL.voltage * 100) / 100).toFixed(1) : "-"} V</TableCell>
                                                <TableCell>{this.props.roverController.FL && this.props.roverController.FL.current ? this.props.roverController.FL.current : "-"} mA</TableCell>
                                                <TableCell>{this.props.roverController.FL && this.props.roverController.FL.dutyCycleTarget ? this.props.roverController.FL.dutyCycleTarget : "-"}</TableCell>
                                                <TableCell>{this.props.roverController.FL && this.props.roverController.FL.dutyCycle ? this.props.roverController.FL.dutyCycle : "-"}</TableCell>
                                            </>)}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell scope="row" background={(this.props.roverController.RR && this.props.roverController.RR.error) ? "status-critical" : "none"}>
                                                <strong>Rear R</strong>
                                            </TableCell>
                                            <TableCell background={(this.props.roverController.RR && this.props.roverController.RR.error) ? "status-critical" : "none"}>
                                                <strong>{this.props.roverController.RR ? (this.props.roverController.RR.error ? this.props.roverController.RR.error : "OK") : "-"}</strong>
                                            </TableCell>
                                            {(size !== "small" && size !== "xsmall" && <>
                                                <TableCell>{this.props.roverController.RR && this.props.roverController.RR.voltage ? (Math.round(this.props.roverController.RR.voltage * 100) / 100).toFixed(1) : "-"} V</TableCell>
                                                <TableCell>{this.props.roverController.RR && this.props.roverController.RR.current ? this.props.roverController.RR.current : "-"} mA</TableCell>
                                                <TableCell>{this.props.roverController.RR && this.props.roverController.RR.dutyCycleTarget ? this.props.roverController.RR.dutyCycleTarget : "-"}</TableCell>
                                                <TableCell>{this.props.roverController.RR && this.props.roverController.RR.dutyCycle ? this.props.roverController.RR.dutyCycle : "-"}</TableCell>
                                            </>)}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell scope="row" background={(this.props.roverController.RL && this.props.roverController.RL.error) ? "status-critical" : "none"}>
                                                <strong>Rear L</strong>
                                            </TableCell>
                                            <TableCell background={(this.props.roverController.RL && this.props.roverController.RL.error) ? "status-critical" : "none"}>
                                                <strong>{this.props.roverController.RL ? (this.props.roverController.RL.error ? this.props.roverController.RL.error : "OK") : "-"}</strong>
                                            </TableCell>
                                            {(size !== "small" && size !== "xsmall" && <>
                                                <TableCell>{this.props.roverController.RL && this.props.roverController.RL.voltage ? (Math.round(this.props.roverController.RL.voltage * 100) / 100).toFixed(1) : "-"} V</TableCell>
                                                <TableCell>{this.props.roverController.RL && this.props.roverController.RL.current ? this.props.roverController.RL.current : "-"} mA</TableCell>
                                                <TableCell>{this.props.roverController.RL && this.props.roverController.RL.dutyCycleTarget ? this.props.roverController.RL.dutyCycleTarget : "-"}</TableCell>
                                                <TableCell>{this.props.roverController.RL && this.props.roverController.RL.dutyCycle ? this.props.roverController.RL.dutyCycle : "-"}</TableCell>
                                            </>)}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </StyledCard>
        </Box>
        </StyledCard>
                    <StyledCard wide title="Acceleration - should be Velocity" foottext={!(this.props.roverIMU.accel) && "Real velocity plot over time"}>
                      {this.props.roverIMU.accel && (<>
                        <Box align="center" justify="center">
                          <MovingGraph data={this.props.roverIMU.accel} unit="m/s2" />
                        </Box>
                      </>)}
                    </StyledCard>
                    <StyledCard wide title="Angular velocity" foottext={!(this.props.roverIMU.gyro) && "Yaw, pitch, roll"}>
                      {this.props.roverIMU.gyro && (<>
                        <Box align="center" justify="center">
                          <MovingGraph data={this.props.roverIMU.gyro} unit="°/s" />
                        </Box>
                      </>)}
                    </StyledCard>
                    <StyledCard wide title="OBC Status" foottext={"Temperatures data"}>
                        <Box align="center" justify="center">
                        </Box>
                    </StyledCard>
                  </Box>;
    }
}

export default NewStatus;

const ControllerDiagram = (props) => {
    return (
        <Stack guidingChild={1}>
            <Diagram
                connections={[
                    {
                        fromTarget: '1',
                        toTarget: '0',
                        thickness: 'xsmall',
                        color: props.roverController.FL && props.roverController.FL.online !== undefined ? (props.roverController.FL.error ? "accent-1" : "accent-4") : "status-unknown",
                        type: 'curved',
                    },
                    {
                        fromTarget: '2',
                        toTarget: '0',
                        thickness: 'xsmall',
                        color: props.roverController.FR && props.roverController.FR.online !== undefined ? (props.roverController.FR.error ? "accent-1" : "accent-4") : "status-unknown",
                        type: 'curved',
                    },
                    {
                        fromTarget: '3',
                        toTarget: '0',
                        thickness: 'xsmall',
                        color: props.roverController.RL && props.roverController.RL.online !== undefined ? (props.roverController.RL.error ? "accent-1" : "accent-4") : "status-unknown",
                        type: 'curved',
                    },
                    {
                        fromTarget: '4',
                        toTarget: '0',
                        thickness: 'xsmall',
                        color: props.roverController.RR && props.roverController.RR.online !== undefined ? (props.roverController.RR.error ? "accent-1" : "accent-4") : "status-unknown",
                        type: 'curved',
                    }
                ]}
            />
            <Box>
                <Box direction="row">
                    <Box id="1" margin="small" pad="medium" background={props.roverController.FL && props.roverController.FL.online !== undefined ? (props.roverController.FL.error ? "status-critical" : "status-ok") : "status-unknown"} />
                    <Box id="5" margin="small" pad="medium" background="none" />
                    <Box id="2" margin="small" pad="medium" background={props.roverController.FR && props.roverController.FR.online !== undefined ? (props.roverController.FR.error ? "status-critical" : "status-ok") : "status-unknown"} />
                </Box>
                <Box direction="row" justify="center">
                    <Box id="0" margin="small" pad="medium" background="#313131"><Trigger size="medium" color={props.isConnected ? "brand" : "status-unknown"} /></Box>
                </Box>
                <Box direction="row">
                    <Box id="3" margin="small" pad="medium" background={props.roverController.RL && props.roverController.RL.online !== undefined ? (props.roverController.RL.error ? "status-critical" : "status-ok") : "status-unknown"} />
                    <Box id="8" margin="small" pad="medium" background="none" />
                    <Box id="4" margin="small" pad="medium" background={props.roverController.RR && props.roverController.RR.online !== undefined ? (props.roverController.RR.error ? "status-critical" : "status-ok") : "status-unknown"} />
                </Box>
            </Box>
        </Stack>
    )
}

const Bounds = (props) => {
    return (
        <Box direction="row" align="center" gap="small">
            <Button
                className="btouch"
                plain={false}
                disabled={!props.enable || props.value === undefined || isNaN(props.value) || props.value === 0 || props.value === 1}
                icon={<Subtract color="brand" />}
                onClick={() => {
                    //props.setValue(props.value - 1);
                }}
                onMouseDown={(event) => props.setDPad(event, "21")}
                onMouseUp={(event) => props.setDPad(event, false)}
                onMouseLeave={(event) => props.setDPad(event, false)}
                onTouchStart={(event) => props.setDPad(event, "21", false)}
                onTouchEnd={(event) => props.setDPad(event, false)}
            />
            <Box align="center" width="medium">
                <RangeInput
                    min={1}
                    max={10}
                    step={1}
                    // This is disabled because it is too jerky/laggy
                    disabled={true || props.value === undefined || isNaN(props.value) || props.value === 0}
                    value={(props.value === undefined || isNaN(props.value) || props.value === 0) ? 5 : props.value}
                    onChange={event => {
                        props.setValue(false, parseInt(event.target.value), false);
                    }}
                />
            </Box>
            <Button
                className="btouch"
                plain={false}
                disabled={!props.enable || props.value === undefined || isNaN(props.value) || props.value === 0 || props.value === 10}
                icon={<Add color="brand" />}
                onClick={() => {
                    //props.setValue(props.value - 1);
                }}
                onMouseDown={(event) => props.setDPad(event, "11")}
                onMouseUp={(event) => props.setDPad(event, false)}
                onMouseLeave={(event) => props.setDPad(event, false)}
                onTouchStart={(event) => props.setDPad(event, "11", false)}
                onTouchEnd={(event) => props.setDPad(event, false)}
            />
        </Box>
    );
};
